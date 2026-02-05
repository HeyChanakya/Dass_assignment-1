// Admin Controller
const Admin = require('../models/Admin');
const Organizer = require('../models/Organizer');
const Participant = require('../models/Participant');
const Event = require('../models/Event');
const crypto = require('crypto');

// @desc    Create organizer account
// @route   POST /api/admin/organizers
// @access  Private (Admin)
const createOrganizer = async (req, res) => {
  try {
    const { organizerName, category, description, contactEmail } = req.body;

    if (!organizerName || !category || !description || !contactEmail) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if organizer already exists
    const existingOrganizer = await Organizer.findOne({ contactEmail });
    if (existingOrganizer) {
      return res.status(400).json({ message: 'Organizer with this email already exists' });
    }

    // Generate login credentials
    const loginEmail = `${organizerName.toLowerCase().replace(/\s+/g, '_')}@felicity.org`;
    const password = crypto.randomBytes(8).toString('hex');

    const organizer = await Organizer.create({
      organizerName,
      category,
      description,
      contactEmail,
      loginEmail,
      password
    });

    res.status(201).json({
      message: 'Organizer created successfully',
      organizer: {
        _id: organizer._id,
        organizerName: organizer.organizerName,
        loginEmail,
        temporaryPassword: password,
        contactEmail: organizer.contactEmail
      }
    });
  } catch (error) {
    console.error('Create organizer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all organizers
// @route   GET /api/admin/organizers
// @access  Private (Admin)
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find()
      .select('-password')
      .populate('events')
      .sort({ createdAt: -1 });

    res.json(organizers);
  } catch (error) {
    console.error('Get all organizers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete organizer
// @route   DELETE /api/admin/organizers/:id
// @access  Private (Admin)
const deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Check if organizer has active events
    const activeEvents = await Event.find({
      organizer: req.params.id,
      status: { $in: ['Published', 'Ongoing'] }
    });

    if (activeEvents.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete organizer with active events. Please close all events first.'
      });
    }

    await organizer.deleteOne();
    res.json({ message: 'Organizer deleted successfully' });
  } catch (error) {
    console.error('Delete organizer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    const totalParticipants = await Participant.countDocuments();
    const totalOrganizers = await Organizer.countDocuments();
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'Published' });

    const recentParticipants = await Participant.find()
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentEvents = await Event.find()
      .populate('organizer', 'organizerName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalParticipants,
        totalOrganizers,
        totalEvents,
        activeEvents
      },
      recentParticipants,
      recentEvents
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrganizer,
  getAllOrganizers,
  deleteOrganizer,
  getDashboard
};
