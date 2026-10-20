const mongoose = require('mongoose');

const mockInterviewSessionSchema = new mongoose.Schema({
  _id: { type: String },
  candidateId: { type: String, required: true },
  role: { type: String, default: 'Software Engineer' },
  type: { type: String, enum: ['Behavioral', 'Technical', 'System Design'], default: 'Technical' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  transcript: [
    {
      sender: { type: String, enum: ['ai', 'candidate'] },
      text: { type: String, required: true },
      category: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now },
      evaluation: {
        score: Number,
        starScore: Number,
        technicalAccuracy: Number,
        communicationClarity: Number,
        strengths: [String],
        improvements: [String],
        modelAnswer: String
      }
    }
  ],
  readinessScore: { type: Number, default: 75 },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockInterviewSession', mockInterviewSessionSchema);
