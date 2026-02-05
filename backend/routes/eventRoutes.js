// Event Routes
const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTrendingEvents
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllEvents);
router.get('/trending', getTrendingEvents);
router.get('/:id', getEventById);

// Protected routes (organizer only)
router.post('/', protect, authorize('organizer'), createEvent);
router.put('/:id', protect, authorize('organizer'), updateEvent);
router.delete('/:id', protect, authorize('organizer'), deleteEvent);

module.exports = router;
