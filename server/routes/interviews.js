const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  startInterview,
  answerQuestion,
  getInterviewById,
  getUserInterviews,
} = require('../controllers/interviewController');

router.get('/', protect, authorize('JOB_SEEKER'), getUserInterviews);
router.post('/', protect, authorize('JOB_SEEKER'), startInterview);
router.get('/:id', protect, authorize('JOB_SEEKER'), getInterviewById);
router.post('/:id/answer', protect, authorize('JOB_SEEKER'), answerQuestion);

module.exports = router;
