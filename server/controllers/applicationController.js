const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Profile = require('../models/Profile');

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply OR POST /api/applications
// @access  Private (Job Seeker)
const applyForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.body.jobId;

  if (!jobId) {
    res.status(400);
    throw new Error('Job ID is required');
  }

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job posting not found');
  }

  if (!job.isActive) {
    res.status(400);
    throw new Error('This job posting is no longer active');
  }

  // Check for duplicate application
  const existingApp = await Application.findOne({
    jobId,
    applicantId: req.user._id,
  });

  if (existingApp) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  // Create application
  const application = await Application.create({
    jobId,
    applicantId: req.user._id,
    status: 'Applied',
  });

  await application.populate('jobId', 'title company location jobType salary');

  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted successfully',
  });
});

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private (Job Seeker)
const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicantId: req.user._id })
    .populate({
      path: 'jobId',
      select: 'title company location jobType salary isActive',
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get applicants for a recruiter's job
// @route   GET /api/jobs/:jobId/applicants
// @access  Private (Recruiter)
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  const applications = await Application.find({ jobId: req.params.jobId })
    .populate('applicantId', 'name email createdAt')
    .sort({ createdAt: -1 });

  // Attach profiles for applicants
  const applicationsWithProfiles = await Promise.all(
    applications.map(async (app) => {
      const appObj = app.toObject();
      if (app.applicantId?._id) {
        const profile = await Profile.findOne({ userId: app.applicantId._id });
        appObj.profile = profile || null;
      }
      return appObj;
    })
  );

  res.json({
    success: true,
    count: applicationsWithProfiles.length,
    data: applicationsWithProfiles,
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

  if (!status || !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${allowedStatuses.join(', ')}`);
  }

  const application = await Application.findById(req.params.id).populate('jobId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Ensure user updating is the recruiter who posted the job
  if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update status for this application');
  }

  application.status = status;
  await application.save();

  res.json({
    success: true,
    data: application,
    message: `Application status updated to '${status}'`,
  });
});

module.exports = {
  applyForJob,
  getUserApplications,
  getJobApplicants,
  updateApplicationStatus,
};
