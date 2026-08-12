const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  applyForJob,
  getUserApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

// Job Seeker routes
router.get('/', protect, authorize('JOB_SEEKER'), getUserApplications);
router.post('/', protect, authorize('JOB_SEEKER'), applyForJob);

// Recruiter routes
router.put('/:id/status', protect, authorize('RECRUITER'), updateApplicationStatus);

module.exports = router;
