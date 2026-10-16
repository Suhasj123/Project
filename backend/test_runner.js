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
  const server = app.listen(PORT);
  console.log(`[Test Server] Running on http://localhost:${PORT}`);

  const baseUrl = `http://localhost:${PORT}`;

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

  console.log('\n--- 2. Authentication & User Profile Tests ---');

  await testEndpoint('POST /api/auth/register (Student)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `test_student_${Date.now()}@example.com`,
        password: 'Password123!'
      })
    });
    const data = await res.json();
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Registration failed: ${data.message}`);
    }
    if (data.token) studentToken = data.token;
  });

  await testEndpoint('POST /api/auth/login (Admin Login)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'suhasjsuhasj505@gmail.com',
        password: 'AdminMaster2026!'
      })
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`Admin login failed: ${data.message}`);
    }
    if (!data.token || data.user.role !== 'admin') {
      throw new Error(`Expected admin role, got ${JSON.stringify(data.user)}`);
    }
    adminToken = data.token;
  });

  await testEndpoint('POST /api/auth/direct-access & direct candidate login', async () => {
    const resSend = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@placement.com' })
    });
    const dataSend = await resSend.json();
    if (resSend.status !== 200 || !dataSend.success) {
      throw new Error(`Direct access check failed: ${dataSend.message}`);
    }

    const resVerify = await fetch(`${baseUrl}/api/auth/direct-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@placement.com' })
    });
    const dataVerify = await resVerify.json();
    if (resVerify.status !== 200 || !dataVerify.token) {
      throw new Error(`Direct candidate access failed: ${dataVerify.message || 'No token returned'}`);
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
