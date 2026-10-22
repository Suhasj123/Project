const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Require all routes
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

async function runTests() {
  console.log('--------------------------------------------------');
  console.log('🚀 STARTING INTERVIEW PRO AUTOMATED TEST SUITE 🚀');
  console.log('--------------------------------------------------\n');

  // Step 1: Connect to DB (or hybrid mock mode)
  await connectDB();

  // Step 2: Initialize Express App
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'online', app: 'InterviewPro', timestamp: new Date() });
  });

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
  app.use('/api/whiteboard', whiteboardRoutes);
  app.use('/api/sdlc', sdlcRoutes);

  const PORT = 5099;
  const server = await new Promise((resolve) => {
    const s = app.listen(PORT, '127.0.0.1', () => resolve(s));
  });
  console.log(`[Test Server] Running on http://127.0.0.1:${PORT}`);

  const baseUrl = `http://127.0.0.1:${PORT}`;

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  let studentToken = '';
  let adminToken = '';

  console.log('\n--- 1. Health & Core Infrastructure Tests ---');

  await testEndpoint('GET /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'online') {
      throw new Error(`Expected online status, got ${JSON.stringify(data)}`);
    }
  });

  console.log('\n--- 2. Authentication, Phone & RBAC Tests ---');

  const testCandidateEmail = `candidate_test_${Date.now()}@example.com`;
  let testResetToken = '';

  await testEndpoint('POST /api/auth/register (Valid Candidate with 10-digit Phone)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Suryaprakash Candidate',
        email: testCandidateEmail,
        phone: '9876543210',
        password: 'CandidatePass2026!',
        confirmPassword: 'CandidatePass2026!'
      })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.success) {
      throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    }
    if (data.message !== 'Registration successful. Please log in.') {
      throw new Error(`Unexpected message: ${data.message}`);
    }
  });

  await testEndpoint('POST /api/auth/register (Reject Duplicate Email)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Candidate',
        email: testCandidateEmail,
        password: 'CandidatePass2026!',
        confirmPassword: 'CandidatePass2026!'
      })
    });
    const data = await res.json();
    if (res.status !== 400 || !data.message.toLowerCase().includes('already registered')) {
      throw new Error(`Expected 400 duplicate email error, got ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  await testEndpoint('POST /api/auth/register (Phone Validation: reject invalid lengths & letters)', async () => {
    // Test 1: Letters in phone
    const resLetters = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid Phone',
        email: `invalid_phone_${Date.now()}@example.com`,
        phone: '98765abcd0',
        password: 'ValidPass2026!',
        confirmPassword: 'ValidPass2026!'
      })
    });
    if (resLetters.status !== 400) {
      throw new Error(`Expected 400 for phone with letters, got ${resLetters.status}`);
    }

    // Test 2: 9 digits (too short)
    const resShort = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Phone',
        email: `short_phone_${Date.now()}@example.com`,
        phone: '987654321',
        password: 'ValidPass2026!',
        confirmPassword: 'ValidPass2026!'
      })
    });
    if (resShort.status !== 400) {
      throw new Error(`Expected 400 for 9-digit phone, got ${resShort.status}`);
    }
  });

  await testEndpoint('POST /api/auth/login (Reject Unregistered Email with exact message)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'unregistered_ghost_user_999@example.com',
        password: 'Password123!'
      })
    });
    const data = await res.json();
    if (res.status !== 404 || data.message !== 'Account not found. Please create a student account.') {
      throw new Error(`Expected 404 with exact message, got ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  await testEndpoint('POST /api/auth/login (Reject Incorrect Password with exact message)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: 'WrongPassword123!'
      })
    });
    const data = await res.json();
    if (res.status !== 401 || data.message !== 'Invalid email or password.') {
      throw new Error(`Expected 401 with exact message, got ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  await testEndpoint('POST /api/auth/login (Candidate Login Success with Registered Credentials)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: 'CandidatePass2026!'
      })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token) {
      throw new Error(`Expected successful candidate login, got ${res.status}: ${JSON.stringify(data)}`);
    }
    if (data.user.role !== 'student' && data.user.role !== 'candidate') {
      throw new Error(`Expected student role, got ${data.user.role}`);
    }
    studentToken = data.token;
  });

  await testEndpoint('POST /api/auth/login (Reject Candidate attempting Admin Console login)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: 'CandidatePass2026!',
        loginMode: 'admin'
      })
    });
    const data = await res.json();
    if (res.status !== 403 || !data.message.includes('administrator privileges')) {
      throw new Error(`Expected 403 forbidden for candidate on admin console, got ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  await testEndpoint('POST /api/auth/login (Admin Master Login Success)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'suhasjsuhasj505@gmail.com',
        password: 'AdminMaster2026!',
        loginMode: 'admin'
      })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token || data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.token;
  });

  await testEndpoint('GET /api/admin/analytics (Verify Candidate Blocked & Admin Allowed)', async () => {
    // 1. Candidate token blocked
    const resCandidate = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    if (resCandidate.status !== 403) {
      throw new Error(`Expected candidate to receive 403 on admin endpoint, got ${resCandidate.status}`);
    }

    // 2. Admin token allowed
    const resAdmin = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (resAdmin.status !== 200) {
      throw new Error(`Expected admin to receive 200 on admin endpoint, got ${resAdmin.status}`);
    }
  });

  await testEndpoint('POST /api/auth/forgot-password & /api/auth/reset-password (Zero-OTP Flow)', async () => {
    const resForgot = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testCandidateEmail })
    });
    const dataForgot = await resForgot.json();
    if (resForgot.status !== 200) {
      throw new Error(`Forgot password failed: ${JSON.stringify(dataForgot)}`);
    }

    // Extract the token directly from MongoDB or dev link
    const User = require('./models/User');
    const userDoc = await User.findOne({ email: testCandidateEmail });
    if (!userDoc || !userDoc.resetPasswordToken) {
      throw new Error('Reset password token was not stored in MongoDB');
    }

    // For testing reset-password endpoint, we need the raw token or generate one
    const crypto = require('crypto');
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    userDoc.resetPasswordToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    userDoc.resetPasswordExpire = Date.now() + 3600000;
    await userDoc.save();

    const resReset = await fetch(`${baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: rawResetToken,
        password: 'NewCandidatePass2026!',
        confirmPassword: 'NewCandidatePass2026!'
      })
    });
    const dataReset = await resReset.json();
    if (resReset.status !== 200 || !dataReset.success) {
      throw new Error(`Reset password endpoint failed: ${JSON.stringify(dataReset)}`);
    }

    // Verify login with new password works
    const resNewLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: 'NewCandidatePass2026!'
      })
    });
    if (resNewLogin.status !== 200) {
      throw new Error(`Login with new password failed after reset: ${resNewLogin.status}`);
    }
  });

  console.log('\n--- 3. Code Execution Engine Tests ---');

  await testEndpoint('POST /api/execution/run (JavaScript snippet)', async () => {
    const res = await fetch(`${baseUrl}/api/execution/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code: 'function twoSum(nums, target) { return [0, 1]; }',
        testCases: [{ input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }]
      })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || data.score !== 100) {
      throw new Error(`Execution failed or failed tests: ${JSON.stringify(data)}`);
    }
  });

  console.log('\n--- 4. Placement Companies & Question Modules ---');

  await testEndpoint('GET /api/companies (Fetch list of recruiters)', async () => {
    const res = await fetch(`${baseUrl}/api/companies`);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.companies || data)) {
      throw new Error(`Failed to fetch companies: ${JSON.stringify(data)}`);
    }
  });

  console.log('\n--- 5. AI Mentor Chatbot Tests ---');

  await testEndpoint('POST /api/mentor/chat (Ask technical question)', async () => {
    const res = await fetch(`${baseUrl}/api/mentor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        query: 'What is the difference between Process and Thread in OS?',
        domain: 'CS Fundamentals'
      })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.reply) {
      throw new Error(`Mentor response error: ${JSON.stringify(data)}`);
    }
  });

  console.log('\n--- 6. Admin Control Center & Analytics Tests ---');

  await testEndpoint('GET /api/admin/analytics (System Metrics)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`Admin analytics failed: ${data.message}`);
    }
  });

  await testEndpoint('GET /api/admin/users (User Management List)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`Admin users endpoint failed: ${data.message}`);
    }
  });

  console.log('\n--- 7. Quizzes & Assessment Engine ---');

  await testEndpoint('GET /api/quizzes/questions (Fetch placement questions)', async () => {
    const res = await fetch(`${baseUrl}/api/quizzes/questions?category=Aptitude`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`Quiz questions error: ${data.message}`);
    }
  });

  await testEndpoint('GET /api/sdlc/incremental-model/questions (Fetch SDLC questions)', async () => {
    const res = await fetch(`${baseUrl}/api/sdlc/incremental-model/questions`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !Array.isArray(data.questions)) {
      throw new Error(`SDLC questions error: ${JSON.stringify(data)}`);
    }
  });

  server.close();

  console.log('\n==================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
