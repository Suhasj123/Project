const mongoose = require('mongoose');

const codingHintLogSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  problemId: { type: String, required: true },
  userCode: { type: String, default: '' },
  hintText: { type: String, required: true },
  explicitSolutionRequested: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodingHintLog', codingHintLogSchema);
