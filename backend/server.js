const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');

const executionRoutes = require('./routes/executionRoutes');
const aiPrepRoutes = require('./routes/aiPrepRoutes');
const quickAssessmentRoutes = require('./routes/quickAssessmentRoutes');

const gamificationRoutes = require('./routes/gamificationRoutes');
const resumeBuilderRoutes = require('./routes/resumeBuilderRoutes');
const whiteboardRoutes = require('./routes/whiteboardRoutes');
const sdlcRoutes = require('./routes/sdlcRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'InterviewPro - Full-Stack Online Hiring & Assessment Platform API',
    timestamp: new Date()
  });
});

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/ai', aiPrepRoutes);
app.use('/api/quick-assessment', quickAssessmentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);
app.use('/api/sdlc', sdlcRoutes);
const { sendCandidateEmail } = require('./services/emailService');

app.post('/api/email/send', async (req, res) => {
  const { toEmail, candidateName, subject, message, decision } = req.body;
  if (!toEmail) {
    return res.status(400).json({ message: 'Recipient email address is required' });
  }

  const result = await sendCandidateEmail({ toEmail, candidateName: candidateName || 'Candidate', subject, message, decision });
  if (result.success) {
    res.json({ message: 'Email dispatched successfully!', messageId: result.messageId, previewUrl: result.previewUrl });
  } else {
    res.status(500).json({ message: 'Failed to send email', error: result.error });
  }
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Internal Error]', err);
  res.status(500).json({ message: 'Internal Server Error: ' + err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚀 AI Interview Prep Server running on port ${PORT}`);
  console.log(` 🌐 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another running instance.`);
    console.log(`👉 The server is ALREADY running and healthy at http://localhost:${PORT}`);
    console.log(`👉 You do not need to run another terminal. Just open your browser at http://localhost:3002\n`);
  } else {
    console.error('[Server Error]', err);
  }
});
