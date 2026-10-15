const mongoose = require('mongoose');

const resumeBuilderSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  targetRole: { type: String, default: 'Software Engineer' },
  jdText: { type: String, default: '' },
  structuredResume: {
    candidate_info: {
      name: String,
      email: String,
      phone: String,
      role: String,
      location: String,
      linkedin: String,
      github: String
    },
    summary: String,
    skills: {
      technical: [String],
      frameworks: [String],
      tools: [String]
    },
    experience: [
      {
        title: String,
        company: String,
        dates: String,
        bullets: [String]
      }
    ],
    projects: [
      {
        name: String,
        tech_stack: [String],
        description: String,
        bullets: [String]
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeBuilder', resumeBuilderSchema);
