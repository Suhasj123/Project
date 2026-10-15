const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  badgeIcon: { type: String, required: true },
  category: { type: String, default: 'General' }
});

module.exports = mongoose.model('Achievement', achievementSchema);
