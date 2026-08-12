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
// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI CareerPilot API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/resumes', require('./routes/resume'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/dashboard', require('./routes/dashboard'));

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
