const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Profile = require('../models/Profile');

/**
 * Calculate skill match score and breakdown transparently
 * Formula: (Matched Skills Count / Required Skills Count) * 100
 */
const calculateJobMatch = (jobRequiredSkills, userSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
    return { matchPercentage: 100, matchedSkills: [], missingSkills: [] };
  }

  const normalizedUserSkills = (userSkills || []).map((s) => s.trim().toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  jobRequiredSkills.forEach((reqSkill) => {
    const isMatched = normalizedUserSkills.includes(reqSkill.trim().toLowerCase());
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    description,
    requiredSkills,
    location,
    salary,
    experience,
    jobType,
    applicationDeadline,
  } = req.body;

  // Process requiredSkills if sent as string or array
  let skillsArray = requiredSkills;
  if (typeof requiredSkills === 'string') {
    skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  const job = await Job.create({
    recruiterId: req.user._id,
    title,
    company,
    description,
    requiredSkills: skillsArray,
    location,
    salary,
    experience,
    jobType,
    applicationDeadline,
  });

  res.status(201).json({
    success: true,
    data: job,
    message: 'Job created successfully',
  });
});

// @desc    Get all jobs (Search, filter, pagination, skill match score)
// @route   GET /api/jobs
// @access  Public / Private
const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    jobType,
    location,
    experience,
    page = 1,
    limit = 10,
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Text search on title, company, description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { requiredSkills: { $elemMatch: { $regex: search, $options: 'i' } } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobType) {
    query.jobType = jobType;
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (experience) {
    query.experience = { $regex: experience, $options: 'i' };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Fetch user profile skills for skill match calculation if user authenticated
  let userSkills = [];
  if (req.user && req.user.role === 'JOB_SEEKER') {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (profile) {
      userSkills = profile.skills || [];
    }
  }

  // Attach match score calculations to jobs
  const jobsWithMatch = jobs.map((job) => {
    const jobObj = job.toObject();
    const match = calculateJobMatch(job.requiredSkills, userSkills);
    jobObj.matchScore = match.matchPercentage;
    jobObj.matchDetails = match;
    return jobObj;
  });

  res.json({
    success: true,
    count: jobsWithMatch.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: jobsWithMatch,
  });
});

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('recruiterId', 'name email');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  let userSkills = [];
  if (req.user && req.user.role === 'JOB_SEEKER') {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (profile) {
      userSkills = profile.skills || [];
    }
  }

  const jobObj = job.toObject();
  jobObj.matchDetails = calculateJobMatch(job.requiredSkills, userSkills);
  jobObj.matchScore = jobObj.matchDetails.matchPercentage;

  res.json({
    success: true,
    data: jobObj,
  });
});

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Ensure recruiter owns the job posting
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  if (req.body.requiredSkills && typeof req.body.requiredSkills === 'string') {
    req.body.requiredSkills = req.body.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: job,
    message: 'Job updated successfully',
  });
});

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Ensure recruiter owns the job posting
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();

  res.json({
    success: true,
    message: 'Job removed successfully',
  });
});

// @desc    Get recruiter's posted jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter only)
const getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
};
