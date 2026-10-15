const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'student', 'recruiter', 'admin'], default: 'candidate' },
  targetRole: { type: String, default: 'Software Engineer' },
  appliedJobRole: { type: String, default: 'Software Engineer' },
  skills: [{ type: String }],
  experienceLevel: { type: String, default: 'Entry Level (0-2 Yrs)' },
  resumeUrl: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  profilePic: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  streakDays: { type: Number, default: 1 },
  lastActiveDate: { type: Date, default: Date.now },
  readinessScore: { type: Number, default: 65 },
  weakTopics: [{ type: String }],
  strongTopics: [{ type: String }],
  achievements: [{ type: String }],
  applicationStatus: { type: String, enum: ['Applied', 'Aptitude Completed', 'Coding Completed', 'Interview Scheduled', 'Interview Completed', 'Hired', 'Rejected', 'On Hold'], default: 'Applied' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
