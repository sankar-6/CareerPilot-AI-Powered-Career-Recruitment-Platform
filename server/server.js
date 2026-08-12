const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/env');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Static uploads folder (local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { errorHandler } = require('./middleware/errorHandler');

// ─── API Routes ─────────────────────────────────────────────
// Root API Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 AI CareerPilot Backend API is live and operational!',
    documentation: 'Refer to /api/health for system status.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profile: '/api/profile',
      resumes: '/api/resumes',
      jobs: '/api/jobs',
      applications: '/api/applications',
      interviews: '/api/interviews',
      dashboard: '/api/dashboard',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI CareerPilot API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Routes (Mounted on both /api/path and /path for maximum compatibility)
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const resumeRouter = require('./routes/resume');
const jobRouter = require('./routes/jobs');
const applicationRouter = require('./routes/applications');
const interviewRouter = require('./routes/interviews');
const dashboardRouter = require('./routes/dashboard');

app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/profile', profileRouter);
app.use('/profile', profileRouter);

app.use('/api/resumes', resumeRouter);
app.use('/resumes', resumeRouter);

app.use('/api/jobs', jobRouter);
app.use('/jobs', jobRouter);

app.use('/api/applications', applicationRouter);
app.use('/applications', applicationRouter);

app.use('/api/interviews', interviewRouter);
app.use('/interviews', interviewRouter);

app.use('/api/dashboard', dashboardRouter);
app.use('/dashboard', dashboardRouter);

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// Start server with automatic port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️  Port ${port} is in use, trying ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(`❌ Server error: ${err.message}`);
      process.exit(1);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer(config.port);

module.exports = app;
