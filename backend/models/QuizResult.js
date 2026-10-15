const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizType: { type: String, enum: ['Aptitude', 'Coding'], required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  answers: [
    {
      questionId: { type: String },
      questionText: { type: String },
      userAnswer: { type: String },
      correctAnswer: { type: String },
      isCorrect: { type: Boolean },
      explanation: { type: String },
      subTopic: { type: String }
    }
  ],
  weakTopicsIdentified: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
