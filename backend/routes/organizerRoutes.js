// Organizer Routes
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboard,
  getAllOrganizers,
  getOrganizerById
} = require('../controllers/organizerController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllOrganizers);
router.get('/:id', getOrganizerById);

// Protected routes (organizer only)
router.get('/profile', protect, authorize('organizer'), getProfile);
router.put('/profile', protect, authorize('organizer'), updateProfile);
router.get('/dashboard', protect, authorize('organizer'), getDashboard);

module.exports = router;
