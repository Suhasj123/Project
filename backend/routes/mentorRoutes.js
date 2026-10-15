const express = require('express');
const router = express.Router();
const { askMentor } = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, askMentor);

module.exports = router;
