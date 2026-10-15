const mongoose = require('mongoose');

const companyReviewSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  authorName: { type: String, default: 'Anonymous Candidate' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  role: { type: String, default: 'Software Engineer' },
  pros: { type: String, required: true },
  cons: { type: String, required: true },
  experienceText: { type: String, default: '' },
  isReported: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyReview', companyReviewSchema);
