const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateReferralCode, validateReferralCode } = require('../utils/referralUtils');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Generate referral code for the user
router.post('/generate-code', auth, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.referralCode) {
      user.referralCode = crypto.randomBytes(4).toString('hex');
      await user.save();
    }

    res.json({ referralCode: user.referralCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply referral code
router.post('/apply-code', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    if (!validateReferralCode(referralCode)) {
      return res.status(400).json({ message: 'Invalid referral code format' });
    }

    const referredUser = await User.findOne({ telegramId: req.user.telegramId });
    
    if (!referredUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (referredUser.referredBy) {
      return res.status(400).json({ message: 'You have already used a referral code' });
    }

    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(400).json({ message: 'Invalid referral code' });
    }

    if (referrer.telegramId === referredUser.telegramId) {
      return res.status(400).json({ message: 'You cannot refer yourself' });
    }

    referredUser.referredBy = referrer._id;
    referrer.referrals.push(referredUser._id);

    // Update referral chain (limit to 10 levels)
    const referralChain = [referrer._id, ...referrer.referralChain.slice(0, 9)];
    referredUser.referralChain = referralChain;

    // Distribute XP to referral chain
    let xpToDistribute = 1000;
    for (let i = 0; i < referralChain.length; i++) {
      const chainUser = await User.findById(referralChain[i]);
      const xpShare = Math.floor(xpToDistribute * 0.1);
      chainUser.xp += xpShare;
      await chainUser.save();
      xpToDistribute -= xpShare;
    }

    await referredUser.save();
    await referrer.save();

    res.json({ message: 'Referral code applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get referral statistics
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId })
      .populate('referrals', 'username xp computePower');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      totalReferrals: user.referrals.length,
      referralXP: user.referrals.reduce((total, referral) => total + referral.xp, 0),
      topReferrals: user.referrals
        .sort((a, b) => b.computePower - a.computePower)
        .slice(0, 5)
        .map(r => ({ username: r.username, computePower: r.computePower }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
