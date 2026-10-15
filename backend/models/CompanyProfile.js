const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  companyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  industry: { type: String, default: 'Technology & Software' },
  about: { type: String, default: '' },
  culture: { type: String, default: '' },
  interviewProcess: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  qaList: [
    {
      id: String,
      question: String,
      answer: String,
      category: String,
      upvotes: { type: Number, default: 12 }
    }
  ],
  salaryRows: [
    {
      role: String,
      experience: String,
      averageSalary: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
