const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation', 'Coding', 'Software Engineering', 'Technical', 'Core CS'] 
  },
  subTopic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true }, // For MCQ, exact text or option index
  explanation: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  language: { type: String, default: 'General' }, // C, C++, Java, Python, JavaScript, General
  questionType: { type: String, enum: ['MCQ', 'Output', 'Debugging', 'Problem', 'Coding'], default: 'MCQ' },
  referenceNotes: { type: String, default: 'Focus on understanding core principles and practicing formulas.' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
