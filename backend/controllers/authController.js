// Auth Controller - Handle authentication for all user types
const Participant = require('../models/Participant');
const Organizer = require('../models/Organizer');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Register participant
// @route   POST /api/auth/register/participant
// @access  Public
const registerParticipant = async (req, res) => {
  // TODO: Implement participant registration logic
  res.status(501).json({ message: 'Not implemented yet' });
};

// @desc    Login user (participant/organizer/admin)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  // TODO: Implement login logic for all user types
  res.status(501).json({ message: 'Not implemented yet' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // TODO: Return current logged-in user info
  res.status(501).json({ message: 'Not implemented yet' });
};

module.exports = {
  registerParticipant,
  login,
  getMe
};
