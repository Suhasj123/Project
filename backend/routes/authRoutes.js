const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, updateProfile, getProfile, directCandidateAccess, sendOTP, verifyOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/direct-access', directCandidateAccess);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
