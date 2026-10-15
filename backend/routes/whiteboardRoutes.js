const express = require('express');
const router = express.Router();
const WhiteboardSnapshot = require('../models/WhiteboardSnapshot');

let memorySnapshots = {};

// POST /api/whiteboard/snapshot
router.post('/snapshot', async (req, res) => {
  const { scheduleId = 'sched_demo', sessionId = '', elementsJson = '[]', appStateJson = '{}' } = req.body;

  try {
    const snapshot = new WhiteboardSnapshot({
      scheduleId,
      sessionId,
      elementsJson,
      appStateJson
    });
    await snapshot.save();
    memorySnapshots[scheduleId] = { elementsJson, appStateJson };
    return res.json({ message: 'Whiteboard canvas snapshot saved!', timestamp: new Date() });
  } catch (err) {
    memorySnapshots[scheduleId] = { elementsJson, appStateJson };
    return res.json({ message: 'Whiteboard snapshot saved in memory.', timestamp: new Date() });
  }
});

// GET /api/whiteboard/snapshot/:scheduleId
router.get('/snapshot/:scheduleId', async (req, res) => {
  const { scheduleId } = req.params;

  try {
    let snapshot = await WhiteboardSnapshot.findOne({ scheduleId }).sort({ createdAt: -1 });
    if (!snapshot) {
      snapshot = memorySnapshots[scheduleId] || { elementsJson: '[]', appStateJson: '{}' };
    }
    return res.json(snapshot);
  } catch (err) {
    return res.json(memorySnapshots[scheduleId] || { elementsJson: '[]', appStateJson: '{}' });
  }
});

module.exports = router;
