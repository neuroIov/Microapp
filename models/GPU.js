const mongoose = require('mongoose');

const gpuSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  level: { type: Number, default: 1 },
  computePower: { type: Number, default: 1 },
  totalTaps: { type: Number, default: 0 },
  lastTapTime: { type: Date },
  cooldownEndTime: { type: Date },
});

gpuSchema.index({ user: 1 });
gpuSchema.index({ computePower: -1 }); // For leaderboard queries

module.exports = mongoose.model('GPU', gpuSchema);