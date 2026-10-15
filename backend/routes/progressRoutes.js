const express = require('express');
const router = express.Router();
const { getProgressOverview, getAchievements } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, getProgressOverview);
router.get('/achievements', protect, getAchievements);

module.exports = router;
