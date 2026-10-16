const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeResume, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Secure in-memory storage with strict file size limits (5 MB max)
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf'
];

const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are accepted for resume analysis.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size to prevent memory exhaustion / DoS
    files: 1
  },
  fileFilter
});

router.post('/analyze', protect, (req, res, next) => {
  upload.single('resumeFile')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum allowed size is 5 MB.' });
      }
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, analyzeResume);

router.get('/history', protect, getResumeHistory);

module.exports = router;
