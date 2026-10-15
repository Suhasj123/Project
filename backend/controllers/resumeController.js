const ResumeAnalysis = require('../models/ResumeAnalysis');
const aiService = require('../services/aiService');
const { getIsMockMode } = require('../config/db');

let memoryResumes = [];

exports.analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const targetRole = req.body.targetRole || 'Software Engineer';
    const fileName = req.file ? req.file.originalname : (req.body.fileName || 'My_Resume.pdf');

    // If file was uploaded via multer, parse text or use sample string if text extraction isn't available
    if (req.file) {
      resumeText = req.file.buffer ? req.file.buffer.toString('utf-8') : 'Resume content uploaded.';
    }

    if (!resumeText || resumeText.trim().length < 10) {
      resumeText = `Jane Doe - BCA Graduate. Experienced in Java, React.js, Node.js, Express, MongoDB, SQL, HTML, CSS, and Git. Built AI Interview Preparation Web App using MERN stack. Strong understanding of Data Structures, OOP, and Database concepts.`;
    }

    const analysis = await aiService.analyzeResumeText(resumeText, targetRole);

    const record = {
      _id: getIsMockMode() ? 'res_an_' + Date.now() : undefined,
      userId: req.user._id,
      fileName,
      atsScore: analysis.atsScore,
      extractedSkills: analysis.extractedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      tailoredQuestions: analysis.tailoredQuestions,
      summary: analysis.summary,
      createdAt: new Date()
    };

    if (!getIsMockMode()) {
      await ResumeAnalysis.create(record);
    } else {
      memoryResumes.push(record);
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('[Analyze Resume Error]', error);
    res.status(500).json({ message: 'Failed to analyze resume: ' + error.message });
  }
};

exports.getResumeHistory = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json(memoryResumes.filter(r => r.userId === req.user._id));
    }
    const history = await ResumeAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume analysis history' });
  }
};
