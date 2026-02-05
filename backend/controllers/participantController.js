// Participant Controller
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Organizer = require('../models/Organizer');

// @desc    Get participant profile
// @route   GET /api/participants/profile
// @access  Private (Participant)
const getProfile = async (req, res) => {
  try {
    const participant = await Participant.findById(req.user._id)
      .select('-password')
      .populate('followedClubs', 'organizerName category');
    
    res.json(participant);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update participant profile
// @route   PUT /api/participants/profile
// @access  Private (Participant)
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, collegeName, areasOfInterest } = req.body;
    
    const participant = await Participant.findById(req.user._id);
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Update allowed fields
    if (firstName) participant.firstName = firstName;
    if (lastName) participant.lastName = lastName;
    if (contactNumber) participant.contactNumber = contactNumber;
    if (collegeName) participant.collegeName = collegeName;
    if (areasOfInterest) participant.areasOfInterest = areasOfInterest;

    await participant.save();

    res.json({
      message: 'Profile updated successfully',
      participant: await Participant.findById(participant._id).select('-password')
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get participant dashboard
// @route   GET /api/participants/dashboard
// @access  Private (Participant)
const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    
    // Get all registrations for this participant
    const registrations = await Registration.find({ participant: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'organizerName' }
      })
      .sort({ createdAt: -1 });

    // Categorize events
    const upcomingEvents = [];
    const completedEvents = [];
    const cancelledEvents = [];

    registrations.forEach(reg => {
      if (!reg.event) return;
      
      if (reg.registrationStatus === 'Cancelled' || reg.registrationStatus === 'Rejected') {
        cancelledEvents.push(reg);
      } else if (new Date(reg.event.eventEndDate) < now || reg.event.status === 'Completed') {
        completedEvents.push(reg);
      } else {
        upcomingEvents.push(reg);
      }
    });

    res.json({
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      normalEvents: registrations.filter(r => r.event && r.event.eventType === 'Normal'),
      merchandiseEvents: registrations.filter(r => r.event && r.event.eventType === 'Merchandise')
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Follow/Unfollow organizer
// @route   POST /api/participants/follow/:organizerId
// @access  Private (Participant)
const followOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;
    
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const participant = await Participant.findById(req.user._id);
    
    // Check if already following
    const isFollowing = participant.followedClubs.includes(organizerId);
    
    if (isFollowing) {
      // Unfollow
      participant.followedClubs = participant.followedClubs.filter(
        id => id.toString() !== organizerId
      );
      organizer.followers = organizer.followers.filter(
        id => id.toString() !== participant._id.toString()
      );
    } else {
      // Follow
      participant.followedClubs.push(organizerId);
      organizer.followers.push(participant._id);
    }

    await participant.save();
    await organizer.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Follow organizer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  followOrganizer
};
