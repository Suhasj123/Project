const express = require('express');
const router = express.Router();
const { getInterviewQuestions, submitInterview, getInterviewHistory } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/questions', protect, getInterviewQuestions);
router.post('/submit', protect, submitInterview);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
