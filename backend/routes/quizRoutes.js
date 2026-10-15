const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz, getAIExplanation, toggleBookmark, getBookmarks } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/questions', protect, getQuizQuestions);
router.post('/submit', protect, submitQuiz);
router.post('/ai-explain', protect, getAIExplanation);
router.post('/bookmark', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
