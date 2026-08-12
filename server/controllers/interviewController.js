const asyncHandler = require('express-async-handler');
const Interview = require('../models/Interview');
const {
  generateInterviewQuestions,
  evaluateAnswer,
  evaluateOverallInterview,
} = require('../services/aiService');

// @desc    Start new AI Interview Practice Session
// @route   POST /api/interviews
// @access  Private (Job Seeker)
const startInterview = asyncHandler(async (req, res) => {
  const { role, topic, difficulty = 'Medium' } = req.body;

  if (!role || !topic) {
    res.status(400);
    throw new Error('Role and topic are required');
  }

  // Generate questions via AI
  const aiQuestionsData = await generateInterviewQuestions(role, topic, difficulty);

  const questions = (aiQuestionsData.questions || []).map((q) => ({
    question: q.question,
    userAnswer: '',
    score: null,
    feedback: '',
  }));

  const interview = await Interview.create({
    userId: req.user._id,
    role,
    topic,
    difficulty,
    questions,
    status: 'in_progress',
  });

  res.status(201).json({
    success: true,
    data: interview,
    message: 'AI Interview practice session created',
  });
});

// @desc    Submit answer to an interview question
// @route   POST /api/interviews/:id/answer
// @access  Private (Job Seeker)
const answerQuestion = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview session not found');
  }

  if (interview.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized for this interview session');
  }

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    res.status(400);
    throw new Error('Invalid question index');
  }

  const questionObj = interview.questions[questionIndex];
  questionObj.userAnswer = answer;

  // Evaluate single answer with AI
  const evalResult = await evaluateAnswer(
    interview.role,
    interview.topic,
    questionObj.question,
    answer
  );

  questionObj.score = evalResult.score;
  questionObj.feedback = evalResult.feedback;

  // Check if all questions have been answered
  const allAnswered = interview.questions.every((q) => q.userAnswer && q.userAnswer.trim().length > 0);

  if (allAnswered) {
    const overall = await evaluateOverallInterview(interview.questions);
    interview.overallScore = overall.overallScore;
    interview.strengths = overall.strengths;
    interview.improvements = overall.improvements;
    interview.status = 'completed';
  }

  await interview.save();

  res.json({
    success: true,
    data: interview,
    currentQuestionFeedback: evalResult,
    message: 'Answer submitted and evaluated',
  });
});

// @desc    Get single interview details
// @route   GET /api/interviews/:id
// @access  Private (Job Seeker)
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview session not found');
  }

  if (interview.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json({
    success: true,
    data: interview,
  });
});

// @desc    Get user's interview practice history
// @route   GET /api/interviews
// @access  Private (Job Seeker)
const getUserInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: interviews.length,
    data: interviews,
  });
});

module.exports = {
  startInterview,
  answerQuestion,
  getInterviewById,
  getUserInterviews,
};
