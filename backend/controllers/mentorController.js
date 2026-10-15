const aiService = require('../services/aiService');

exports.askMentor = async (req, res) => {
  try {
    const { query, domain } = req.body;
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query cannot be empty' });
    }

    const reply = await aiService.askMentor(query, { domain });
    res.json({ reply });
  } catch (error) {
    console.error('[Mentor Controller Error]', error);
    res.status(500).json({ message: 'Failed to process AI Mentor response' });
  }
};
