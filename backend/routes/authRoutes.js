// Auth Routes
const express = require('express');
const router = express.Router();
const { 
  registerParticipant, 
  login, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register/participant', registerParticipant);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
