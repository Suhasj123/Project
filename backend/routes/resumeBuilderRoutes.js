const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const ResumeBuilder = require('../models/ResumeBuilder');

const handleBuildResume = async (req, res) => {
  const { resumeText = '', targetRole = 'Software Engineer', jdText = '', candidateId = 'cand_101' } = req.body;

  try {
    const structuredResume = await aiService.getResumeBuilderJSON(resumeText, targetRole, jdText, req.body);

    try {
      const doc = new ResumeBuilder({
        candidateId,
        targetRole,
        jdText,
        structuredResume
      });
      await doc.save();
    } catch (e) {}

    return res.json({ structuredResume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

router.post('/', handleBuildResume);
router.post('/resume-builder', handleBuildResume);

module.exports = router;
