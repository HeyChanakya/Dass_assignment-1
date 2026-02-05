// Auth Controller - Handle authentication for all user types
const Participant = require('../models/Participant');
const Organizer = require('../models/Organizer');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const validator = require('validator');

// @desc    Register participant
// @route   POST /api/auth/register/participant
// @access  Public
const registerParticipant = async (req, res) => {
  try {
    const { firstName, lastName, email, password, participantType, collegeName, contactNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !participantType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if IIIT student and validate email domain
    if (participantType === 'IIIT') {
      const emailDomain = email.split('@')[1];
      if (!emailDomain || !emailDomain.includes('iiit')) {
        return res.status(400).json({ message: 'IIIT students must use their IIIT email address' });
      }
    }

    // Check if user already exists
    const existingUser = await Participant.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create participant
    const participant = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      participantType,
      collegeName,
      contactNumber
    });

    if (participant) {
      res.status(201).json({
        _id: participant._id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        participantType: participant.participantType,
        role: 'participant',
        token: generateToken(participant._id, 'participant')
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user (participant/organizer/admin)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Try to find user in all collections
    let user = null;
    let role = null;

    // Check Admin
    user = await Admin.findOne({ email });
    if (user) {
      role = 'admin';
      console.log('Found admin user:', email);
    }

    // Check Organizer
    if (!user) {
      user = await Organizer.findOne({ $or: [{ contactEmail: email }, { loginEmail: email }] });
      if (user) {
        role = 'organizer';
      }
    }

    // Check Participant
    if (!user) {
      user = await Participant.findOne({ email });
      if (user) {
        role = 'participant';
      }
    }

    // If user not found
    if (!user) {
      console.log('✗ User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    console.log('Checking password for user:', email, 'role:', role);
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('✗ Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('✓ Login successful for:', email, 'as', role);

    // Return user data with token
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      organizerName: user.organizerName || null,
      role: role,
      token: generateToken(user._id, role)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      user: req.user,
      role: req.userRole
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerParticipant,
  login,
  getMe
};
