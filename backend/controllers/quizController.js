const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { seedQuestions } = require('../utils/seedData');
const { getIsMockMode } = require('../config/db');

// In-memory cache fallback for questions when DB is in mock mode
let memoryQuestions = [...seedQuestions.map((q, idx) => ({ ...q, _id: `mock_q_${idx + 1}` }))];
let memoryResults = [];
let memoryBookmarks = [];

// 1. Get Questions for Quiz (Aptitude or Coding)
exports.getQuizQuestions = async (req, res) => {
  try {
    const { category, language, difficulty, limit } = req.query;
    const maxCount = parseInt(limit) || 10;

    if (getIsMockMode()) {
      let filtered = [...memoryQuestions];
      if (category && category !== 'All') {
        filtered = filtered.filter(q => q.category.toLowerCase() === category.toLowerCase());
      }
      if (language && language !== 'All') {
        filtered = filtered.filter(q => q.language.toLowerCase() === language.toLowerCase());
      }
      if (difficulty && difficulty !== 'All') {
        filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }

      // Shuffle array
      filtered.sort(() => 0.5 - Math.random());
      return res.json(filtered.slice(0, maxCount));
    }

    let filterQuery = {};
    if (category && category !== 'All') filterQuery.category = category;
    if (language && language !== 'All') filterQuery.language = language;
    if (difficulty && difficulty !== 'All') filterQuery.difficulty = difficulty;

    const questions = await Question.find(filterQuery);

    if (questions.length === 0) {
      // Fallback to seedQuestions if DB collection is empty
      let fallbackFiltered = [...seedQuestions.map((q, idx) => ({ ...q, _id: `seed_q_${idx + 1}` }))];
      if (category && category !== 'All') {
        fallbackFiltered = fallbackFiltered.filter(q => q.category.toLowerCase() === category.toLowerCase());
      }
      fallbackFiltered.sort(() => 0.5 - Math.random());
      return res.json(fallbackFiltered.slice(0, maxCount));
    }

    // Shuffle and slice
    questions.sort(() => 0.5 - Math.random());
    res.json(questions.slice(0, maxCount));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz questions: ' + error.message });
  }
};

// 2. Submit Quiz & Return Learning Center Breakdown
exports.submitQuiz = async (req, res) => {
  try {
    const { quizType, category, answers, timeSpentSeconds } = req.body;
    const userId = req.user._id;

    let score = 0;
    let totalQuestions = answers.length;
    let evaluatedAnswers = [];
    let weakTopicsIdentified = [];

    for (let ans of answers) {
      let qObj = null;
      if (!getIsMockMode()) {
        try {
          qObj = await Question.findById(ans.questionId);
        } catch (e) {}
      }

      if (!qObj) {
        qObj = memoryQuestions.find(m => m._id && ans.questionId && String(m._id) === String(ans.questionId)) || {
          questionText: ans.questionText || 'Sample Placement Question',
          correctAnswer: ans.correctAnswer || 'Option A',
          explanation: 'Refer to core fundamentals.',
          subTopic: ans.subTopic || 'General'
        };
      }

      const isCorrect = ans.userAnswer && (ans.userAnswer.trim() === qObj.correctAnswer.trim());
      if (isCorrect) {
        score += 1;
      } else {
        if (qObj.subTopic && !weakTopicsIdentified.includes(qObj.subTopic)) {
          weakTopicsIdentified.push(qObj.subTopic);
        }
      }

      evaluatedAnswers.push({
        questionId: ans.questionId,
        questionText: qObj.questionText,
        userAnswer: ans.userAnswer || 'Skipped',
        correctAnswer: qObj.correctAnswer,
        isCorrect,
        explanation: qObj.explanation,
        subTopic: qObj.subTopic,
        referenceNotes: qObj.referenceNotes,
        difficulty: qObj.difficulty
      });
    }

    const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);

    const resultPayload = {
      _id: getIsMockMode() ? 'res_' + Date.now() : undefined,
      userId,
      quizType: quizType || 'Aptitude',
      category: category || 'General',
      score,
      totalQuestions,
      percentage,
      timeSpentSeconds: timeSpentSeconds || 120,
      answers: evaluatedAnswers,
      weakTopicsIdentified,
      createdAt: new Date()
    };

    if (!getIsMockMode()) {
      await QuizResult.create(resultPayload);

      // Update User streak and readiness score
      try {
        const user = await User.findById(userId);
        if (user) {
          user.readinessScore = Math.min(100, Math.max(30, Math.round(user.readinessScore * 0.7 + percentage * 0.3)));
          if (weakTopicsIdentified.length > 0) {
            user.weakTopics = Array.from(new Set([...(user.weakTopics || []), ...weakTopicsIdentified]));
          }
          await user.save();
        }
      } catch (e) {}
    } else {
      memoryResults.push(resultPayload);
    }

    res.status(201).json(resultPayload);
  } catch (error) {
    console.error('[Submit Quiz Error]', error);
    res.status(500).json({ message: 'Failed to evaluate quiz submission' });
  }
};

// 3. AI Explanation Endpoint
exports.getAIExplanation = async (req, res) => {
  try {
    const { questionText, correctAnswer, userAnswer, explanation } = req.body;
    const aiResp = await aiService.explainQuestion(questionText, correctAnswer, userAnswer, explanation);
    res.json({ aiExplanation: aiResp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI explanation' });
  }
};

// 4. Bookmark Question
exports.toggleBookmark = async (req, res) => {
  try {
    const { questionId, questionText, category, subTopic } = req.body;
    const userId = req.user._id;

    if (getIsMockMode()) {
      const idx = memoryBookmarks.findIndex(b => b.questionId === questionId && b.userId === userId);
      if (idx >= 0) {
        memoryBookmarks.splice(idx, 1);
        return res.json({ bookmarked: false, message: 'Bookmark removed' });
      } else {
        memoryBookmarks.push({ userId, questionId, questionText, category, subTopic });
        return res.json({ bookmarked: true, message: 'Question bookmarked' });
      }
    }

    const existing = await Bookmark.findOne({ userId, questionId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ bookmarked: false, message: 'Bookmark removed' });
    }

    await Bookmark.create({ userId, questionId, questionText, category, subTopic });
    res.json({ bookmarked: true, message: 'Question bookmarked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling bookmark' });
  }
};

// 5. Get User Bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json(memoryBookmarks.filter(b => b.userId === req.user._id));
    }
    const bookmarks = await Bookmark.find({ userId: req.user._id });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
};

module.exports.memoryQuestions = memoryQuestions;
module.exports.memoryResults = memoryResults;
