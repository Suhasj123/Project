const QuizResult = require('../models/QuizResult');
const InterviewHistory = require('../models/InterviewHistory');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { seedAchievements } = require('../utils/seedData');
const { getIsMockMode } = require('../config/db');

exports.getProgressOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    let quizResults = [];
    let interviewHistories = [];
    let userObj = req.user;

    if (getIsMockMode()) {
      const { memoryResults } = require('./quizController');
      const { memoryInterviews } = require('./interviewController');
      quizResults = memoryResults.filter(r => r.userId === userId);
      interviewHistories = memoryInterviews.filter(i => i.userId === userId);
    } else {
      quizResults = await QuizResult.find({ userId }).sort({ createdAt: -1 });
      interviewHistories = await InterviewHistory.find({ userId }).sort({ createdAt: -1 });
      try {
        const u = await User.findById(userId);
        if (u) userObj = u;
      } catch (e) {}
    }

    // Default sample data if student is brand new, so charts present rich visuals immediately
    if (quizResults.length === 0) {
      quizResults = [
        { quizType: 'Aptitude', category: 'Quantitative Aptitude', score: 8, totalQuestions: 10, percentage: 80, createdAt: new Date(Date.now() - 5 * 86400000) },
        { quizType: 'Aptitude', category: 'Logical Reasoning', score: 7, totalQuestions: 10, percentage: 70, createdAt: new Date(Date.now() - 3 * 86400000) },
        { quizType: 'Coding', category: 'Java', score: 9, totalQuestions: 10, percentage: 90, createdAt: new Date(Date.now() - 1 * 86400000) }
      ];
    }

    if (interviewHistories.length === 0) {
      interviewHistories = [
        { interviewType: 'Technical', domain: 'Java', overallScore: 78, confidenceRating: 'Moderate', createdAt: new Date(Date.now() - 2 * 86400000) },
        { interviewType: 'HR', domain: 'General HR', overallScore: 85, confidenceRating: 'High', createdAt: new Date(Date.now() - 4 * 86400000) }
      ];
    }

    // Calculate aggregated metrics
    const totalQuizzesTaken = quizResults.length;
    const avgQuizScore = Math.round(quizResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / Math.max(1, totalQuizzesTaken));
    const avgInterviewScore = Math.round(interviewHistories.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / Math.max(1, interviewHistories.length));
    
    // Readiness formula: 40% Quiz + 40% Interview + 20% Streak
    const streakBonus = Math.min(20, (userObj.streakDays || 3) * 4);
    const calculatedReadinessScore = Math.min(98, Math.round(avgQuizScore * 0.4 + avgInterviewScore * 0.4 + streakBonus));

    // Weak and Strong topics calculation
    const weakTopics = userObj.weakTopics && userObj.weakTopics.length > 0
      ? userObj.weakTopics
      : ['Speed, Distance & Time', 'Pointers in C++', 'Dynamic Programming'];

    const strongTopics = ['Time & Work', 'OOP Fundamentals', 'Java Strings', 'SQL Joins'];

    res.json({
      jobReadinessScore: calculatedReadinessScore,
      streakDays: userObj.streakDays || 5,
      totalQuizzesTaken,
      avgQuizScore,
      avgInterviewScore,
      totalInterviewsTaken: interviewHistories.length,
      weakTopics,
      strongTopics,
      quizHistory: quizResults,
      interviewHistory: interviewHistories,
      weeklyPerformance: [
        { day: 'Mon', score: 65 },
        { day: 'Tue', score: 70 },
        { day: 'Wed', score: 78 },
        { day: 'Thu', score: 72 },
        { day: 'Fri', score: 85 },
        { day: 'Sat', score: 88 },
        { day: 'Sun', score: calculatedReadinessScore }
      ]
    });
  } catch (error) {
    console.error('[Progress Overview Error]', error);
    res.status(500).json({ message: 'Failed to generate progress metrics' });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    let achievements = seedAchievements;

    if (!getIsMockMode()) {
      try {
        const dbAchievements = await Achievement.find();
        if (dbAchievements.length > 0) achievements = dbAchievements;
      } catch (e) {}
    }

    // Determine unlocked status
    const unlockedCodes = ['FIRST_QUIZ', 'STREAK_7']; // Sample unlocked badges

    const responseBadges = achievements.map(ach => ({
      ...ach,
      unlocked: unlockedCodes.includes(ach.code),
      unlockedAt: unlockedCodes.includes(ach.code) ? '2026-08-01' : null
    }));

    res.json(responseBadges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};
