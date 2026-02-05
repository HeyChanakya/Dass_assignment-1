// Registration Routes
const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventParticipants,
  cancelRegistration
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/', protect, authorize('participant'), registerForEvent);
router.get('/', protect, authorize('participant'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('organizer'), getEventParticipants);
router.delete('/:id', protect, authorize('participant'), cancelRegistration);

module.exports = router;
