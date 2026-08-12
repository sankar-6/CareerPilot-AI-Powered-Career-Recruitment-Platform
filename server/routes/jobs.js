const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');
const { applyForJob, getJobApplicants } = require('../controllers/applicationController');

// Public / Protected job browsing
router.get('/', protect, getJobs);
router.get('/recruiter/my-jobs', protect, authorize('RECRUITER'), getRecruiterJobs);
router.get('/:id', protect, getJobById);

// Recruiter CRUD
router.post('/', protect, authorize('RECRUITER'), createJob);
router.put('/:id', protect, authorize('RECRUITER'), updateJob);
router.delete('/:id', protect, authorize('RECRUITER'), deleteJob);

// Applications on specific job
router.post('/:jobId/apply', protect, authorize('JOB_SEEKER'), applyForJob);
router.get('/:jobId/applicants', protect, authorize('RECRUITER'), getJobApplicants);

module.exports = router;
