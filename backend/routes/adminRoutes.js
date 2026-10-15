const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getAllUsers,
  deleteUser,
  getAllQuestionsAdmin,
  addQuestionAdmin,
  deleteQuestionAdmin,
  getCodingChallenges,
  addCodingChallenge,
  getReports,
  getAISettings,
  updateAISettings,
  getSystemLogs
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/analytics', protect, adminOnly, getAdminAnalytics);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

router.get('/questions', protect, adminOnly, getAllQuestionsAdmin);
router.post('/questions', protect, adminOnly, addQuestionAdmin);
router.delete('/questions/:id', protect, adminOnly, deleteQuestionAdmin);

router.get('/coding-challenges', protect, adminOnly, getCodingChallenges);
router.post('/coding-challenges', protect, adminOnly, addCodingChallenge);

router.get('/reports', protect, adminOnly, getReports);

router.get('/ai-settings', protect, adminOnly, getAISettings);
router.put('/ai-settings', protect, adminOnly, updateAISettings);

router.get('/logs', protect, adminOnly, getSystemLogs);

module.exports = router;
