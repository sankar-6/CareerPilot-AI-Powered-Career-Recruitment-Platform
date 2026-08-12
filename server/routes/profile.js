const express = require('express');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const router = express.Router();

// Get current user's profile
router.get('/me', protect, getProfile);

// Update current user's profile
router.put('/me', protect, updateProfile);

// Upload avatar (optional)
router.post('/avatar', protect, uploadAvatar);

module.exports = router;
