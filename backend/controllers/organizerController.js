// Organizer Controller
const Organizer = require('../models/Organizer');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get organizer profile
// @route   GET /api/organizers/profile
// @access  Private (Organizer)
const getProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user._id).select('-password');
    res.json(organizer);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update organizer profile
// @route   PUT /api/organizers/profile
// @access  Private (Organizer)
const updateProfile = async (req, res) => {
  try {
    const { organizerName, category, description, contactEmail, contactNumber, discordWebhook } = req.body;
    
    const organizer = await Organizer.findById(req.user._id);
    
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    if (organizerName) organizer.organizerName = organizerName;
    if (category) organizer.category = category;
    if (description) organizer.description = description;
    if (contactEmail) organizer.contactEmail = contactEmail;
    if (contactNumber) organizer.contactNumber = contactNumber;
    if (discordWebhook !== undefined) organizer.discordWebhook = discordWebhook;

    await organizer.save();

    res.json({
      message: 'Profile updated successfully',
      organizer: await Organizer.findById(organizer._id).select('-password')
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get organizer dashboard
// @route   GET /api/organizers/dashboard
// @access  Private (Organizer)
const getDashboard = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('participants')
      .sort({ createdAt: -1 });

    // Calculate analytics for completed events
    const completedEvents = events.filter(e => e.status === 'Completed');
    let totalRegistrations = 0;
    let totalRevenue = 0;

    for (const event of completedEvents) {
      const registrations = await Registration.find({ event: event._id, paymentStatus: 'Paid' });
      totalRegistrations += registrations.length;
      totalRevenue += registrations.length * event.registrationFee;
    }

    res.json({
      events,
      analytics: {
        totalEvents: events.length,
        completedEvents: completedEvents.length,
        totalRegistrations,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all organizers (public listing)
// @route   GET /api/organizers
// @access  Public
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find()
      .select('-password -loginEmail')
      .sort({ organizerName: 1 });
    res.json(organizers);
  } catch (error) {
    console.error('Get all organizers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get organizer by ID (public view)
// @route   GET /api/organizers/:id
// @access  Public
const getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id)
      .select('-password -loginEmail');

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const upcomingEvents = await Event.find({
      organizer: req.params.id,
      status: 'Published',
      eventStartDate: { $gte: new Date() }
    }).sort({ eventStartDate: 1 });

    const pastEvents = await Event.find({
      organizer: req.params.id,
      status: 'Completed'
    }).sort({ eventEndDate: -1 });

    res.json({
      organizer,
      upcomingEvents,
      pastEvents
    });
  } catch (error) {
    console.error('Get organizer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  getAllOrganizers,
  getOrganizerById
};
