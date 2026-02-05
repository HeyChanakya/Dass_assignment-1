// Admin Routes
const express = require('express');
const router = express.Router();
const {
  createOrganizer,
  getAllOrganizers,
  deleteOrganizer,
  getDashboard
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/organizers', createOrganizer);
router.get('/organizers', getAllOrganizers);
router.delete('/organizers/:id', deleteOrganizer);

module.exports = router;
