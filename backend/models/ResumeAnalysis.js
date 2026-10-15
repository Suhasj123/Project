const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  targetRole: { type: String, default: 'Software Engineer' },
  jdText: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  matchPercentage: { type: Number, default: 75 },
  matchingSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  suggestedFocusAreas: [{ type: String }],
  roadmap: [
    {
      week: { type: Number, required: true },
      focusTopic: { type: String, required: true },
      suggestedActivity: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
