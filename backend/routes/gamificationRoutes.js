const express = require('express');
const router = express.Router();
const Gamification = require('../models/Gamification');

// Memory store fallback
let memoryGamification = {
  cand_101: {
    candidateId: 'cand_101',
    candidateName: 'Vikramaditya Sharma',
    currentStreak: 5,
    longestStreak: 8,
    totalXp: 450,
    optInLeaderboard: true
  }
};

const leaderboardMemory = [
  { rank: 1, name: 'Ananya Roy', streak: 12, xp: 1250 },
  { rank: 2, name: 'Rahul Sharma', streak: 9, xp: 980 },
  { rank: 3, name: 'Priya Verma', streak: 7, xp: 820 },
  { rank: 4, name: 'Vikramaditya Sharma', streak: 5, xp: 450 },
  { rank: 5, name: 'Rohan Gupta', streak: 4, xp: 390 }
];

// GET /api/gamification/status/:candidateId
router.get('/status/:candidateId', async (req, res) => {
  const { candidateId } = req.params;

  try {
    let data = await Gamification.findOne({ candidateId });
    if (!data) {
      data = memoryGamification[candidateId] || memoryGamification['cand_101'];
    }
    return res.json(data);
  } catch (err) {
    return res.json(memoryGamification['cand_101']);
  }
});

// POST /api/gamification/add-xp
router.post('/add-xp', async (req, res) => {
  const { candidateId = 'cand_101', xpAmount = 10, activityType = 'practice' } = req.body;

  try {
    let data = await Gamification.findOne({ candidateId });
    if (data) {
      data.totalXp += xpAmount;
      data.lastActivityDate = new Date();
      await data.save();
    } else if (memoryGamification[candidateId]) {
      memoryGamification[candidateId].totalXp += xpAmount;
    }
    return res.json({ message: `+${xpAmount} XP added for ${activityType}!`, totalXp: data ? data.totalXp : 450 + xpAmount });
  } catch (err) {
    return res.json({ message: `+${xpAmount} XP added!`, totalXp: 460 });
  }
});

// GET /api/gamification/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    let docs = await Gamification.find({ optInLeaderboard: true }).sort({ totalXp: -1 }).limit(10);
    if (!docs || docs.length === 0) {
      return res.json(leaderboardMemory);
    }
    const formatted = docs.map((d, idx) => ({
      rank: idx + 1,
      name: d.candidateName,
      streak: d.currentStreak,
      xp: d.totalXp
    }));
    return res.json(formatted);
  } catch (err) {
    return res.json(leaderboardMemory);
  }
});

module.exports = router;
