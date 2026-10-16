const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { validateEnv } = require('./config/envValidator');
const { connectDB } = require('./config/db');
const {
  securityHeaders,
  generalLimiter,
  authLimiter,
  aiLimiter,
  emailLimiter,
  sanitizeInput,
  corsOptions
} = require('./middleware/securityMiddleware');
const { protect, adminOnly } = require('./middleware/authMiddleware');

// 1. Run environment security diagnostics
validateEnv();

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
const sdlcRoutes = require('./routes/sdlcRoutes');

const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// Connect to MongoDB
connectDB();

// 2. Apply Security Headers via Helmet
app.use(securityHeaders);

// 3. Apply Hardened CORS
app.use(cors(corsOptions));

// 4. Rate Limiting for all incoming traffic
app.use(generalLimiter);

// 5. Body Parsing with Strict Payload Limits (prevents memory flooding / DoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 6. NoSQL Injection & Payload Sanitization
app.use(sanitizeInput);

// Healthcheck Route (Public)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'InterviewPro - Full-Stack Online Hiring & Assessment Platform API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// 7. API Endpoints with Targeted Rate Limiters & Security
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/ai', aiLimiter, aiPrepRoutes);
app.use('/api/quick-assessment', quickAssessmentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);
app.use('/api/sdlc', sdlcRoutes);

// Protected Email Dispatch (Admin or Verified Candidate Access Only)
const { sendCandidateEmail } = require('./services/emailService');
app.post('/api/email/send', protect, emailLimiter, async (req, res) => {
  const { toEmail, candidateName, subject, message, decision } = req.body;
  if (!toEmail) {
    return res.status(400).json({ message: 'Recipient email address is required' });
  }

  const result = await sendCandidateEmail({ 
    toEmail, 
    candidateName: candidateName || 'Candidate', 
    subject, 
    message, 
    decision 
  });

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

// 8. Secure Error Handling Middleware (Hides internal stack traces in production)
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error('[Server Internal Error]', err.message);

  res.status(err.status || 500).json({ 
    message: isProduction ? 'Internal Server Error' : (err.message || 'An unexpected error occurred'),
    ...(isProduction ? {} : { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚀 AI Interview Prep Server running on port ${PORT}`);
  console.log(` 🌐 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(` 🛡️  Security headers, rate limiting, and CORS enabled`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another running instance.`);
    console.log(`👉 The server is ALREADY running and healthy at http://localhost:${PORT}`);
    console.log(`👉 You do not need to run another terminal. Just open your browser at http://localhost:3000\n`);
  } else {
    console.error('[Server Error]', err);
  }
});
