const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const Interview = require('../models/Interview');

// @desc    Get dashboard metrics for authenticated user (Job Seeker or Recruiter)
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  if (role === 'RECRUITER') {
    // Recruiter metrics
    const myJobs = await Job.find({ recruiterId: userId });
    const jobIds = myJobs.map((j) => j._id);

    const totalJobs = myJobs.length;
    const activeJobs = myJobs.filter((j) => j.isActive).length;

    const allApplications = await Application.find({ jobId: { $in: jobIds } });
    const totalApplicants = allApplications.length;
    const shortlistedCandidates = allApplications.filter(
      (a) => a.status === 'Shortlisted' || a.status === 'Selected'
    ).length;

    const recentApplicants = await Application.find({ jobId: { $in: jobIds } })
      .populate('applicantId', 'name email')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      role,
      data: {
        stats: {
          totalJobs,
          activeJobs,
          totalApplicants,
          shortlistedCandidates,
        },
        recentApplicants,
        myJobs: myJobs.slice(0, 5),
      },
    });
  }

  // Job Seeker metrics
  const profile = await Profile.findOne({ userId });
  const resume = await Resume.findOne({ userId });
  const userApplications = await Application.find({ applicantId: userId }).populate(
    'jobId',
    'title company location jobType salary'
  );
  const userInterviews = await Interview.find({ userId });

  const resumeScore = resume?.analysis?.score || 0;
  const applicationsCount = userApplications.length;
  const shortlistedCount = userApplications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Selected'
  ).length;
  const interviewsCount = userInterviews.length;

  // Recommended jobs based on candidate skills
  const candidateSkills = profile?.skills || [];
  const recommendedJobs = await Job.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5);

  const jobsWithMatch = recommendedJobs.map((job) => {
    const jobObj = job.toObject();
    const reqSkills = job.requiredSkills || [];
    const matched = reqSkills.filter((s) =>
      candidateSkills.map((c) => c.toLowerCase()).includes(s.toLowerCase())
    );
    jobObj.matchScore = reqSkills.length ? Math.round((matched.length / reqSkills.length) * 100) : 100;
    return jobObj;
  });

  return res.json({
    success: true,
    role,
    data: {
      stats: {
        resumeScore,
        applicationsCount,
        shortlistedCount,
        interviewsCount,
      },
      user: req.user,
      profile,
      resume,
      recentApplications: userApplications.slice(0, 5),
      recentInterviews: userInterviews.slice(0, 3),
      recommendedJobs: jobsWithMatch,
    },
  });
});

module.exports = { getDashboardData };
