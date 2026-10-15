const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const aiService = require('../services/aiService');
const { getIsMockMode } = require('../config/db');

const fallbackQuestions = [
  {
    _id: 'sdlc_inc_1',
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Easy',
    questionText: 'What is the core principle of the Incremental SDLC Model?',
    options: [
      'Completing all requirements before writing any code',
      'Breaking the software into manageable increments and delivering functional builds iteratively',
      'Deploying to production without testing each module',
      'Avoiding requirements analysis until the final phase'
    ],
    correctAnswer: 'Breaking the software into manageable increments and delivering functional builds iteratively',
    explanation: 'In the Incremental Model, the overall software system is divided into smaller standalone modules (increments). Each increment goes through full requirements, design, implementation, and testing.',
    referenceNotes: 'Increment 1 typically delivers the core functional product (e.g. Auth & DB).'
  },
  {
    _id: 'sdlc_inc_2',
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Medium',
    questionText: 'Which of the following is a major advantage of the Incremental Model over the traditional Waterfall Model?',
    options: [
      'Zero requirement definition needed upfront',
      'Initial working software is delivered earlier in the life cycle',
      'Lower total overall software cost',
      'No need for system testing or integration testing'
    ],
    correctAnswer: 'Initial working software is delivered earlier in the life cycle',
    explanation: 'Unlike Waterfall where working software is only available at the end of the project, Incremental Model delivers a working core system after Increment 1.',
    referenceNotes: 'Reduces risk of total project failure by validating core modules early.'
  },
  {
    _id: 'sdlc_inc_3',
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Medium',
    questionText: 'When is the Incremental Model most appropriate to use?',
    options: [
      'When requirements are completely unknown and constantly changing daily',
      'When high-priority core requirements are known, but details can evolve in subsequent builds',
      'When the project must be built strictly by a single programmer without modularization',
      'When there is no need for customer feedback'
    ],
    correctAnswer: 'When high-priority core requirements are known, but details can evolve in subsequent builds',
    explanation: 'Incremental model works best when core system architecture can be defined upfront, while secondary features can be refined and added in subsequent increments.',
    referenceNotes: 'Ideal for large projects needing early market entry with MVP.'
  },
  {
    _id: 'sdlc_inc_4',
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Hard',
    questionText: 'What is a key potential disadvantage or risk of the Incremental SDLC Model?',
    options: [
      'Requires careful system design & clean interface architecture upfront to avoid integration breaks',
      'Customers cannot view working software until 100% completion',
      'Does not allow adding new features after increment 1',
      'Eliminates the unit testing phase completely'
    ],
    correctAnswer: 'Requires careful system design & clean interface architecture upfront to avoid integration breaks',
    explanation: 'Because new increments plug into existing modules, poor initial architecture can lead to complex integration bugs and costly refactoring in later increments.',
    referenceNotes: 'Well-defined module interfaces (APIs) are crucial for incremental success.'
  }
];

// Get Incremental Model Questions (from DB or curated fallback)
router.get('/incremental-model/questions', async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json({ success: true, questions: fallbackQuestions });
    }

    const dbQuestions = await Question.find({
      $or: [
        { subTopic: 'Incremental Model' },
        { subTopic: 'SDLC' },
        { category: 'Software Engineering' }
      ]
    }).maxTimeMS(2000);

    if (dbQuestions && dbQuestions.length > 0) {
      return res.json({ success: true, questions: dbQuestions });
    }

    return res.json({ success: true, questions: fallbackQuestions });
  } catch (error) {
    console.warn('[SDLC API Warning - Using Fallback Questions]', error.message);
    return res.json({ success: true, questions: fallbackQuestions });
  }
});

// AI Tutor query for Incremental SDLC Model
router.post('/incremental-model/ai-tutor', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required' });
    }

    const explanation = await aiService.getIncrementalModelTutor(query);
    return res.json({ success: true, explanation });
  } catch (error) {
    console.error('[SDLC AI Tutor Error]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI tutor response'
    });
  }
});

module.exports = router;
