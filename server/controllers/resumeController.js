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

/**
 * Extract text from a PDF buffer using pdf-parse
 */
const extractPdfText = async (fileBuffer, fileName) => {
  try {
    if (fileName && fileName.toLowerCase().endsWith('.pdf') && fileBuffer) {
      const parsedData = await pdfParse(fileBuffer);
      return (parsedData.text || '').trim();
    }
  } catch (err) {
    console.warn('PDF text extraction notice:', err.message);
  }
  return '';
};

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

  // Extract PDF text immediately from the upload buffer before Render discards it
  let extractedText = '';
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'resumes', req.file.filename);
    if (fs.existsSync(filePath)) {
      const dataBuffer = fs.readFileSync(filePath);
      extractedText = await extractPdfText(dataBuffer, fileName);
    }
  } catch (err) {
    console.warn('PDF extraction during upload:', err.message);
  }

  let resume = await Resume.findOne({ userId: req.user._id });

  if (resume) {
    resume.fileUrl = fileUrl;
    resume.fileName = fileName;
    resume.fileSize = fileSize;
    resume.extractedText = extractedText;
    // Clear old analysis when a new file is uploaded
    resume.analysis = { score: null, strengths: [], improvements: [], detectedSkills: [], missingSkills: [] };
    resume.analyzedAt = null;
    await resume.save();
  } else {
    resume = await Resume.create({
      userId: req.user._id,
      fileUrl,
      fileName,
      fileSize,
      extractedText,
    });
  }

  res.status(200).json({
    success: true,
    data: resume,
    message: extractedText.length > 20
      ? `Resume uploaded & ${extractedText.split(/\s+/).length} words extracted successfully!`
      : 'Resume uploaded successfully',
  });
});

// @desc    Run AI Resume Analysis with real PDF Text Parsing
// @route   POST /api/resumes/analyze
// @access  Private
const runAIResumeAnalysis = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  const profile = await Profile.findOne({ userId: req.user._id });

  if (!resume) {
    res.status(400);
    throw new Error('Please upload a resume first before running analysis');
  }

  const userSkills = profile?.skills || [];

  // Priority 1: Use text already extracted and stored in MongoDB
  let extractedPdfText = resume.extractedText || '';

  // Priority 2: Try local file as fallback (only works in local dev, not on Render)
  if (extractedPdfText.length < 20 && resume.fileUrl) {
    try {
      const relativePath = resume.fileUrl.replace(/^\/uploads\//, '');
      const filePath = path.join(__dirname, '..', 'uploads', relativePath);

      if (fs.existsSync(filePath) && filePath.toLowerCase().endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(filePath);
        const parsedData = await pdfParse(dataBuffer);
        extractedPdfText = (parsedData.text || '').trim();

        // Persist extracted text for future analyses
        if (extractedPdfText.length > 20) {
          resume.extractedText = extractedPdfText;
        }
      }
    } catch (err) {
      console.warn('PDF text extraction fallback notice:', err.message);
    }
  }

  // Build rich context for AI
  let resumeContext;
  if (extractedPdfText.length > 20) {
    resumeContext = `Extracted Resume Content:\n${extractedPdfText.substring(0, 4000)}`;
  } else {
    // No text available — tell the AI clearly
    resumeContext = `Resume File: ${resume.fileName}. No extractable text content found in the PDF. User profile skills: ${userSkills.join(', ') || 'None specified'}. Analyze based on the available skill set.`;
  }

  // Call AI Service (Gemini API)
  const analysisResult = await analyzeResume(resumeContext, userSkills);

  // Save analysis results to MongoDB
  resume.analysis = analysisResult;
  resume.analyzedAt = new Date();
  await resume.save();

  // Auto-update user profile with newly detected skills
  if (profile && analysisResult.detectedSkills && analysisResult.detectedSkills.length > 0) {
    const mergedSkills = Array.from(
      new Set([...(profile.skills || []), ...analysisResult.detectedSkills])
    );
    profile.skills = mergedSkills;
    await profile.save();
  }

  res.json({
    success: true,
    data: analysisResult,
    pdfTextExtracted: extractedPdfText.length > 20,
    wordCount: extractedPdfText.split(/\s+/).length,
    message: extractedPdfText.length > 20
      ? `AI analyzed ${extractedPdfText.split(/\s+/).length} words from your resume`
      : 'AI analysis completed based on your profile skills',
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
