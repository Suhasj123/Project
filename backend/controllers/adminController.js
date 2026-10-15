const User = require('../models/User');
const Question = require('../models/Question');
const Company = require('../models/Company');
const QuizResult = require('../models/QuizResult');
const InterviewHistory = require('../models/InterviewHistory');
const { seedQuestions, seedCompanies } = require('../utils/seedData');
const { getIsMockMode } = require('../config/db');

// Memory storage for admin actions
let adminCodingChallenges = [
  { _id: 'cc_1', title: 'Reverse a Linked List', language: 'Python', difficulty: 'Medium', topic: 'Data Structures' },
  { _id: 'cc_2', title: 'Two Sum Problem', language: 'Java', difficulty: 'Easy', topic: 'Arrays' },
  { _id: 'cc_3', title: 'Check Palindrome String', language: 'JavaScript', difficulty: 'Easy', topic: 'Strings' }
];

let adminAISettings = {
  activeProvider: 'OpenAI',
  modelName: 'gpt-3.5-turbo',
  maxTokens: 500,
  temperature: 0.7,
  systemPrompt: 'You are an expert Placement & Interview Mentor for CS candidates.'
};

let adminSystemLogs = [
  { id: 'log_101', type: 'AUTH', message: 'User student@placement.com logged in successfully.', timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 'log_102', type: 'QUIZ', message: 'Aptitude Quiz submitted by user 650000000000000000000001 (Score: 8/10).', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'log_103', type: 'AI_INTERVIEW', message: 'Mock Technical Interview evaluated for Java domain.', timestamp: new Date(Date.now() - 1200000).toISOString() },
  { id: 'log_104', type: 'ADMIN', message: 'Admin suhasjsuhasj505@gmail.com accessed control panel.', timestamp: new Date(Date.now() - 1800000).toISOString() }
];

// 1. View Analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json({
        totalUsers: 48,
        totalQuestions: seedQuestions.length + 15,
        totalCodingChallenges: adminCodingChallenges.length,
        totalQuizzesCompleted: 142,
        totalInterviewsConducted: 52,
        totalCompaniesListed: seedCompanies.length
      });
    }

    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalQuizzesCompleted = await QuizResult.countDocuments();
    const totalInterviewsConducted = await InterviewHistory.countDocuments();
    const totalCompaniesListed = await Company.countDocuments();

    res.json({
      totalUsers,
      totalQuestions: totalQuestions || seedQuestions.length,
      totalCodingChallenges: adminCodingChallenges.length,
      totalQuizzesCompleted,
      totalInterviewsConducted,
      totalCompaniesListed: totalCompaniesListed || seedCompanies.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin analytics' });
  }
};

// 2. Manage Users & Candidate Dossiers
exports.getAllUsers = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json([
        {
          _id: 'cand_101',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          phone: '+91 98765 43210',
          role: 'candidate',
          targetRole: 'Full Stack Developer',
          appliedJobRole: 'Frontend React Engineer',
          skills: ['React', 'JavaScript', 'Node.js', 'TailwindCSS', 'MongoDB', 'Git'],
          experienceLevel: 'Fresher / Entry Level (0-2 Yrs)',
          readinessScore: 92,
          streakDays: 7,
          applicationStatus: 'Interview Completed',
          scores: { aptitude: '90/100 (9/10 Correct)', coding: '95/100 (Passed 4/4 Testcases)', aiInterview: 'STAR 4.8/5.0 (Passed)' },
          proctorWarnings: 0,
          resume: {
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '+91 98765 43210',
            targetRole: 'Full Stack Developer',
            summary: 'Enthusiastic and results-driven Full Stack Developer with strong expertise in React, Node.js, and REST APIs. Passionate about building high-performance web applications and AI-driven platforms.',
            skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript (ES6+)', 'Tailwind CSS', 'Docker', 'Git'],
            experience: 'Software Engineering Intern @ TechSolutions Inc. (6 Months) — Developed responsive React UI components, integrated MongoDB database models, and reduced API response latencies by 25%.',
            projects: '1. InterviewPro AI Portal: Full-stack placement prep platform with WebRTC video room and AI feedback.\n2. E-Commerce Microservices Engine: Scalable shopping cart service using Express & Redis.',
            education: 'B.Tech in Computer Science & Engineering — Global Institute of Technology (2022-2026) | CGPA: 8.9 / 10'
          },
          createdAt: new Date(Date.now() - 864000000)
        },
        {
          _id: 'cand_102',
          name: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '+91 98123 45678',
          role: 'candidate',
          targetRole: 'Backend Engineer',
          appliedJobRole: 'Node.js API Specialist',
          skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Python', 'AWS'],
          experienceLevel: '1-2 Years Experience',
          readinessScore: 86,
          streakDays: 4,
          applicationStatus: 'Coding Completed',
          scores: { aptitude: '80/100 (8/10 Correct)', coding: '88/100 (Passed 3/4 Testcases)', aiInterview: 'Pending Schedule' },
          proctorWarnings: 1,
          resume: {
            name: 'Priya Patel',
            email: 'priya.patel@example.com',
            phone: '+91 98123 45678',
            targetRole: 'Backend Engineer',
            summary: 'Backend Developer specializing in microservices architecture, relational database design, and asynchronous message queues using Node.js and PostgreSQL.',
            skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Python', 'Docker', 'AWS S3', 'REST APIs'],
            experience: 'Junior Backend Developer @ DataCloud Systems (1 Year) — Architected high-throughput API endpoints handling 50k daily active users with Redis caching.',
            projects: '1. Real-time Analytics Pipeline: Data processing engine with Redis & Kafka.\n2. Secure Auth Service: OAuth2 & JWT authentication microservice.',
            education: 'B.E. in Information Technology — National Institute of Engineering (2021-2025) | CGPA: 8.7 / 10'
          },
          createdAt: new Date(Date.now() - 604800000)
        },
        {
          _id: 'cand_103',
          name: 'Student Demo',
          email: 'student@placement.com',
          phone: '+1 (555) 234-5678',
          role: 'student',
          targetRole: 'Software Development Engineer (SDE-1)',
          appliedJobRole: 'Associate Software Engineer',
          skills: ['Java', 'Spring Boot', 'Data Structures', 'SQL', 'React'],
          experienceLevel: 'Entry Level',
          readinessScore: 78,
          streakDays: 5,
          applicationStatus: 'Aptitude Completed',
          scores: { aptitude: '80/100 (8/10 Correct)', coding: 'Pending', aiInterview: 'Pending' },
          proctorWarnings: 0,
          resume: {
            name: 'Student Demo',
            email: 'student@placement.com',
            phone: '+1 (555) 234-5678',
            targetRole: 'Software Development Engineer',
            summary: 'Passionate CS graduate trained in object-oriented programming, data structures, and full-stack web development.',
            skills: ['Java', 'Spring Boot', 'Python', 'SQL', 'HTML5/CSS3', 'Git'],
            experience: 'Academic Projects Lead — Built multi-threaded Java applications and relational database schemas.',
            projects: '1. Algorithmic Trading Simulator: Java-based order matching engine.\n2. Student Placement Portal: React & Express candidate tracking web app.',
            education: 'B.S. in Computer Science — State University | GPA: 3.8 / 4.0'
          },
          createdAt: new Date(Date.now() - 432000000)
        },
        {
          _id: 'admin_1',
          name: 'Suhas Admin',
          email: 'suhasjsuhasj505@gmail.com',
          phone: '+91 99000 11122',
          role: 'admin',
          targetRole: 'System Administrator',
          appliedJobRole: 'Lead Platform Admin',
          skills: ['System Architecture', 'Node.js', 'React', 'MongoDB', 'AI Engineering'],
          experienceLevel: 'Senior / Lead',
          readinessScore: 99,
          streakDays: 30,
          applicationStatus: 'Hired',
          scores: { aptitude: '100/100', coding: '100/100', aiInterview: 'STAR 5.0/5.0' },
          proctorWarnings: 0,
          resume: {
            name: 'Suhas Admin',
            email: 'suhasjsuhasj505@gmail.com',
            phone: '+91 99000 11122',
            targetRole: 'Platform Lead & AI Architect',
            summary: 'Senior Administrator and AI Systems Engineer overseeing placement prep ecosystem, proctoring controls, and interview evaluation models.',
            skills: ['Node.js', 'React', 'AI Model Integration', 'WebSockets', 'MongoDB', 'Cloud Architecture'],
            experience: 'Lead Systems Architect — Orchestrated InterviewPro placement platform serving multi-tenant candidate assessments.',
            projects: '1. InterviewPro Core Architecture: AI video interviewer and camera proctoring system.',
            education: 'M.Tech in Artificial Intelligence & Software Systems'
          },
          createdAt: new Date(Date.now() - 2592000000)
        }
      ]);
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!getIsMockMode()) {
      await User.findByIdAndDelete(id);
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// 3. Manage Questions
exports.getAllQuestionsAdmin = async (req, res) => {
  try {
    if (getIsMockMode()) {
      const { memoryQuestions } = require('./quizController');
      return res.json(memoryQuestions);
    }
    const questions = await Question.find();
    if (questions.length === 0) return res.json(seedQuestions);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.addQuestionAdmin = async (req, res) => {
  try {
    const questionData = {
      _id: 'q_admin_' + Date.now(),
      category: req.body.category,
      subTopic: req.body.subTopic,
      difficulty: req.body.difficulty || 'Medium',
      questionText: req.body.questionText,
      options: req.body.options || [],
      correctAnswer: req.body.correctAnswer,
      explanation: req.body.explanation || 'Standard solution.',
      language: req.body.language || 'General',
      questionType: req.body.questionType || 'MCQ'
    };

    if (getIsMockMode()) {
      const { memoryQuestions } = require('./quizController');
      memoryQuestions.unshift(questionData);
      return res.status(201).json(questionData);
    }

    const newQ = await Question.create(questionData);
    res.status(201).json(newQ);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add question' });
  }
};

exports.deleteQuestionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsMockMode()) {
      const { memoryQuestions } = require('./quizController');
      const idx = memoryQuestions.findIndex(q => q._id === id);
      if (idx >= 0) memoryQuestions.splice(idx, 1);
      return res.json({ message: 'Question deleted successfully' });
    }
    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

// 4. Manage Coding Challenges
exports.getCodingChallenges = async (req, res) => {
  res.json(adminCodingChallenges);
};

exports.addCodingChallenge = async (req, res) => {
  const newChallenge = {
    _id: 'cc_' + Date.now(),
    title: req.body.title,
    language: req.body.language || 'Java',
    difficulty: req.body.difficulty || 'Medium',
    topic: req.body.topic || 'General Coding'
  };
  adminCodingChallenges.unshift(newChallenge);
  res.status(201).json(newChallenge);
};

// 5. View Reports
exports.getReports = async (req, res) => {
  res.json({
    totalAssessmentsGenerated: 142,
    passPercentageAverage: 78.5,
    mostPopularTopic: 'Quantitative Aptitude - Time & Work',
    topWeakTopicBatchwide: 'Pointers in C++',
    avgMockInterviewScore: 82.4
  });
};

// 6. Manage AI Settings
exports.getAISettings = async (req, res) => {
  res.json(adminAISettings);
};

exports.updateAISettings = async (req, res) => {
  adminAISettings = { ...adminAISettings, ...req.body };
  res.json({ message: 'AI settings updated successfully', settings: adminAISettings });
};

// 7. System Logs
exports.getSystemLogs = async (req, res) => {
  res.json(adminSystemLogs);
};
