const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getResume,
  uploadResumeFile,
  runAIResumeAnalysis,
  deleteResume,
} = require('../controllers/resumeController');

router.get('/me', protect, getResume);
router.post('/', protect, upload.single('resume'), uploadResumeFile);
router.post('/analyze', protect, runAIResumeAnalysis);
router.delete('/me', protect, deleteResume);

module.exports = router;
