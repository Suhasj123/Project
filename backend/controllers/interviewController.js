const InterviewHistory = require('../models/InterviewHistory');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { getIsMockMode } = require('../config/db');

let memoryInterviews = [];

// Pre-packaged Domain Questions for smooth interview simulation
const domainQuestionsMap = {
  Java: [
    'Explain the concept of Garbage Collection in Java and how memory is managed in the Heap vs Stack.',
    'What is the difference between final, finally, and finalize in Java?',
    'How does HashMap handle collisions internally in Java 8+?',
    'What are abstract classes and interfaces? When should you use one over the other?'
  ],
  Python: [
    'Explain Python decorators and provide a practical use case where you would write one.',
    'What is the Global Interpreter Lock (GIL) in CPython and how does it affect multi-threaded programs?',
    'Explain the difference between deepcopy and shallowcopy in Python.',
    'How do list comprehensions work, and what are their performance advantages?'
  ],
  MERN: [
    'What is the difference between Virtual DOM and Real DOM in React?',
    'Explain Node.js Event Loop and non-blocking I/O execution.',
    'How do you handle JWT authentication and secure refresh tokens in a React + Express app?',
    'Compare MongoDB document embedding versus referencing for one-to-many relationships.'
  ],
  SQL: [
    'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
    'How do database indexes improve query speed, and what is the trade-off during INSERT/UPDATE?',
    'Explain ACID properties in relation to relational database transactions.',
    'Write an SQL query logic to find the 2nd highest salary from an Employee table.'
  ],
  'C++': [
    'What are smart pointers in C++11 (std::unique_ptr, std::shared_ptr, std::weak_ptr)?',
    'Explain the concept of Virtual Functions and pure virtual functions in C++ polymorphism.',
    'What is the difference between stack allocation and heap allocation using new/delete?',
    'How does standard template library (STL) vector differ from a static array?'
  ],
  'General HR': [
    'Tell me about yourself and your career goals as a fresh computer science graduate.',
    'Describe a situation where you had a conflict during a group project and how you resolved it.',
    'What are your top technical strengths and one genuine weakness you are actively working on?',
    'Why do you want to join our company, and where do you see yourself in 3 years?'
  ]
};

// 1. Get Questions for Interview Simulation
exports.getInterviewQuestions = async (req, res) => {
  try {
    const { interviewType, domain, difficulty } = req.query;
    const selectedDomain = domain || 'Java';
    const questionsList = domainQuestionsMap[selectedDomain] || domainQuestionsMap['Java'];

    res.json({
      interviewType: interviewType || 'Technical',
      domain: selectedDomain,
      difficulty: difficulty || 'Medium',
      questions: questionsList
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate interview questions' });
  }
};

// 2. Submit AI Interview Answers & Evaluate
exports.submitInterview = async (req, res) => {
  try {
    const { interviewType, domain, difficulty, qaPairs } = req.body;
    const userId = req.user._id;

    // Evaluate with AI service
    const evaluation = await aiService.evaluateInterview(interviewType, domain, difficulty, qaPairs);

    const interviewRecord = {
      _id: getIsMockMode() ? 'int_' + Date.now() : undefined,
      userId,
      interviewType: interviewType || 'Technical',
      domain: domain || 'Java',
      difficulty: difficulty || 'Medium',
      overallScore: evaluation.overallScore,
      communicationFeedback: evaluation.communicationFeedback,
      technicalFeedback: evaluation.technicalFeedback,
      confidenceRating: evaluation.confidenceRating,
      suggestions: evaluation.suggestions,
      qaPairs: qaPairs || [],
      createdAt: new Date()
    };

    if (!getIsMockMode()) {
      await InterviewHistory.create(interviewRecord);

      // Update User readiness score
      try {
        const user = await User.findById(userId);
        if (user) {
          user.readinessScore = Math.min(100, Math.round(user.readinessScore * 0.6 + evaluation.overallScore * 0.4));
          await user.save();
        }
      } catch (e) {}
    } else {
      memoryInterviews.push(interviewRecord);
    }

    res.status(201).json(interviewRecord);
  } catch (error) {
    console.error('[Submit Interview Error]', error);
    res.status(500).json({ message: 'Failed to evaluate interview submission' });
  }
};

// 3. Get User Interview History
exports.getInterviewHistory = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json(memoryInterviews.filter(i => i.userId === req.user._id));
    }
    const history = await InterviewHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview history' });
  }
};

module.exports.memoryInterviews = memoryInterviews;
