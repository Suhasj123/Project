const mongoose = require('mongoose');

const whiteboardSnapshotSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true },
  sessionId: { type: String, default: '' },
  elementsJson: { type: String, default: '[]' },
  appStateJson: { type: String, default: '{}' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WhiteboardSnapshot', whiteboardSnapshotSchema);
