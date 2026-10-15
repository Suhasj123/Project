const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  candidateId: { type: String, required: true, unique: true },
  candidateName: { type: String, default: 'Student Candidate' },
  avatarUrl: { type: String, default: '' },
  currentStreak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  totalXp: { type: Number, default: 50 },
  lastActivityDate: { type: Date, default: Date.now },
  optInLeaderboard: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gamification', gamificationSchema);
