const mongoose = require('mongoose');

const quickAssessmentSessionSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  resumeFeedback: {
    strengths: [String],
    suggestions: [String]
  },
  aptitudeScore: { type: Number, default: 0 },
  aptitudeDetails: [
    {
      questionId: String,
      questionText: String,
      candidateAnswer: String,
      correctAnswer: String,
      explanation: String,
      isCorrect: Boolean
    }
  ],
  codingScore: { type: Number, default: 0 },
  codingDetails: [
    {
      problemId: String,
      problemText: String,
      candidateCode: String,
      candidateAnswer: String,
      correctAnswer: String,
      passed: Boolean,
      explanation: String
    }
  ],
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuickAssessmentSession', quickAssessmentSessionSchema);
