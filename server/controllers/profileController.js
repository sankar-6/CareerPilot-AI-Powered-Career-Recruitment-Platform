const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ userId: req.user.id });
  if (!profile) {
    // Auto-create profile for users who registered before auto-creation was added
    profile = await Profile.create({ userId: req.user.id });
  }
  res.json(profile);
});

// @desc    Update current user's profile
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
});
// @desc    Upload avatar (optional)
// @route   POST /api/profile/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  // Placeholder: Expect Cloudinary config and multer middleware in route.
  // Assume file is available as req.file.path and Cloudinary upload returns URL.
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // For now, just store the local file path as avatar URL.
  const avatarUrl = `/uploads/${req.file.filename}`;
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { avatar: avatarUrl } },
    { new: true }
  );
  res.json({ avatar: avatarUrl, profile });
});

module.exports = { getProfile, updateProfile, uploadAvatar };
