// Participant Routes
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboard,
  followOrganizer
} = require('../controllers/participantController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for participants only
router.use(protect);
router.use(authorize('participant'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.post('/follow/:organizerId', followOrganizer);

module.exports = router;
