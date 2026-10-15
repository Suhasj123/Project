const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/analyze', protect, upload.single('resumeFile'), analyzeResume);
router.get('/history', protect, getResumeHistory);

module.exports = router;
