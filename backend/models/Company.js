const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  pattern: {
    rounds: [{ name: String, duration: String, description: String }],
    eligibility: String,
    difficulty: String
  },
  technicalQuestions: [{ question: String, answer: String, topic: String }],
  hrQuestions: [{ question: String, answer: String, tips: String }],
  codingQuestions: [{ title: String, problemStatement: String, solution: String, language: String }],
  experiences: [{ studentName: String, college: String, year: String, verdict: String, story: String }],
  preparationTips: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);
