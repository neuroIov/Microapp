const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, index: true },
  xp: { type: Number, default: 0, index: true },
  compute: { type: Number, default: 0, index: true },
  computePower: { type: Number, default: 1, index: true },
  level: { type: Number, default: 0 },
  lastDailyClaimDate: { type: Date },
  totalTaps: { type: Number, default: 0 },
  lastTapTime: { type: Date, index: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralCode: { type: String, unique: true, sparse: true, index: true },
  referralChain: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added referralChain
  achievements: [{
    id: String,
    completed: Boolean,
    progress: Number
  }],
  dailyQuests: [{
    id: String,
    completed: Boolean,
    progress: Number
  }],
  lastCheckIn: { type: Date },
  checkInStreak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notifications: { type: Boolean, default: true },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'dark' }
}, { timestamps: true }); // Added timestamps option

userSchema.index({ computePower: -1, compute: -1 });

userSchema.virtual('calculatedLevel').get(function() {
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
