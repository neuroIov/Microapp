const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  xpReward: { type: Number, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'bonus'], required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
});

// Compound index for querying active quests
questSchema.index({ type: 1, expiresAt: 1 });

// Check if the model already exists before creating it
module.exports = mongoose.models.Quest || mongoose.model('Quest', questSchema);
