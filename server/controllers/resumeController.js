const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const Profile = require('../models/Profile');
const { analyzeResume } = require('../services/aiService');

// @desc    Get current user's uploaded resume and analysis
// @route   GET /api/resumes/me
// @access  Private
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  if (!resume) {
    return res.json({
      success: true,
      data: null,
      message: 'No resume uploaded yet',
    });
  }
  res.json({ success: true, data: resume });
});

// @desc    Upload or replace resume PDF
// @route   POST /api/resumes
// @access  Private
const uploadResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a valid PDF/DOC file');
  }

  const fileUrl = `/uploads/resumes/${req.file.filename}`;
  const fileName = req.file.originalname;
  const fileSize = req.file.size;

  let resume = await Resume.findOne({ userId: req.user._id });

  if (resume) {
    resume.fileUrl = fileUrl;
    resume.fileName = fileName;
    resume.fileSize = fileSize;
    await resume.save();
  } else {
    resume = await Resume.create({
      userId: req.user._id,
      fileUrl,
      fileName,
      fileSize,
    });
  }

  res.status(200).json({
    success: true,
    data: resume,
    message: 'Resume uploaded successfully',
  });
});

// @desc    Run AI Resume Analysis with real PDF Text Parsing
// @route   POST /api/resumes/analyze
// @access  Private
const runAIResumeAnalysis = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  const profile = await Profile.findOne({ userId: req.user._id });

  const userSkills = profile?.skills || [];
  let extractedPdfText = '';

  // Extract raw text if a local PDF file exists
  if (resume && resume.fileUrl) {
    try {
      const relativePath = resume.fileUrl.replace(/^\/uploads\//, '');
      const filePath = path.join(__dirname, '..', 'uploads', relativePath);

      if (fs.existsSync(filePath) && filePath.toLowerCase().endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(filePath);
        const parsedData = await pdfParse(dataBuffer);
        extractedPdfText = parsedData.text || '';
      }
    } catch (err) {
      console.warn('PDF text extraction notice:', err.message);
    }
  }

  const resumeContext = extractedPdfText.trim().length > 20
    ? `Extracted Resume Content:\n${extractedPdfText.substring(0, 3000)}`
    : `File Name: ${resume?.fileName || 'Candidate Profile'}`;

  // Call AI Service
  const analysisResult = await analyzeResume(resumeContext, userSkills);

  if (resume) {
    resume.analysis = analysisResult;
    resume.analyzedAt = new Date();
    await resume.save();
  }

  // Auto-update user profile with newly detected skills
  if (profile && analysisResult.detectedSkills.length > 0) {
    const mergedSkills = Array.from(
      new Set([...(profile.skills || []), ...analysisResult.detectedSkills])
    );
    profile.skills = mergedSkills;
    await profile.save();
  }

  res.json({
    success: true,
    data: analysisResult,
    message: 'AI Resume Analysis completed',
  });
});

// @desc    Delete current user's resume
// @route   DELETE /api/resumes/me
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  await resume.deleteOne();

  res.json({
    success: true,
    message: 'Resume deleted successfully',
  });
});

module.exports = {
  getResume,
  uploadResumeFile,
  runAIResumeAnalysis,
  deleteResume,
};
