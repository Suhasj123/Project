const mongoose = require('mongoose');

const interviewHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewType: { type: String, enum: ['Technical', 'HR', 'Behavioral'], required: true },
  domain: { type: String, enum: ['Java', 'Python', 'MERN', 'SQL', 'C++', 'General HR'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  overallScore: { type: Number, required: true },
  communicationFeedback: { type: String },
  technicalFeedback: { type: String },
  confidenceRating: { type: String }, // High, Moderate, Needs Practice
  suggestions: [{ type: String }],
  qaPairs: [
    {
      question: { type: String },
      userAnswer: { type: String },
      aiFeedback: { type: String },
      score: { type: Number }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewHistory', interviewHistorySchema);
