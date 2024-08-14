const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, index: true },
  xp: { type: Number, default: 0, index: true },
  compute: { type: Number, default: 0, index: true },
  computePower: { type: Number, default: 1, index: true },
  lastDailyClaimDate: { type: Date },
  totalTaps: { type: Number, default: 0 },
  lastTapTime: { type: Date, index: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralChain: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastCoolingTime: { type: Date },
  cooldownEndTime: { type: Date },
  lastQuestUpdateCheck: { type: Date },
  referralCode: { type: String, unique: true, sparse: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for leaderboard queries
userSchema.index({ computePower: -1, compute: -1 });

// Pre-save middleware to update the 'updatedAt' field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for user's current level based on XP
userSchema.virtual('level').get(function() {
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
});

// Method to check if user can claim daily XP
userSchema.methods.canClaimDailyXP = function() {
  if (!this.lastDailyClaimDate) return true;
  const now = new Date();
  const timeSinceLastClaim = now - this.lastDailyClaimDate;
  return timeSinceLastClaim >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
};

module.exports = mongoose.model('User', userSchema);