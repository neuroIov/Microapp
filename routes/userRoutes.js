const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Start or resume session
router.post('/start', async (req, res) => {
  try {
    const { telegramId, username } = req.user;
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId, username });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Claim daily XP
router.post('/claim-daily-xp', async (req, res) => {
  try {
    const { id } = req.user; // Assuming the JWT payload contains the user's Telegram ID
    let user = await User.findOne({ telegramId: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please start a session first.' });
    }

    const now = new Date();
    if (!user.lastDailyClaimDate || now - user.lastDailyClaimDate > 24 * 60 * 60 * 1000) {
      user.xp += 100;
      user.lastDailyClaimDate = now;
      await user.save();
      res.json({ message: 'Daily XP claimed successfully', user: { xp: user.xp, lastDailyClaimDate: user.lastDailyClaimDate } });
    } else {
      res.status(400).json({ message: 'Daily XP already claimed. Please try again tomorrow.' });
    }
  } catch (error) {
    console.error('Error in claim-daily-xp route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Tap GPU
router.post('/tap', async (req, res) => {
  try {
    const { id } = req.user; // Changed from telegramId to id to match the JWT payload
    const user = await User.findOne({ telegramId: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    if (user.cooldownEndTime && now < user.cooldownEndTime) {
      return res.status(400).json({ message: 'GPU is cooling down', cooldownEndTime: user.cooldownEndTime });
    }

    user.totalTaps += 1;
    user.compute += user.computePower;
    user.lastTapTime = now;

    if (user.totalTaps % 1000 === 0) {
      user.cooldownEndTime = new Date(now.getTime() + 5 * 60 * 1000);
    }

    await user.save();
    res.json({ message: 'Tap successful', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upgrade GPU
router.post('/upgrade-gpu', async (req, res) => {
  try {
    const { telegramId } = req.user;
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const upgradeCost = user.computePower * 100;
    if (user.compute < upgradeCost) {
      return res.status(400).json({ message: 'Not enough compute for upgrade' });
    }

    user.compute -= upgradeCost;
    user.computePower += 1;
    user.cooldownEndTime = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();
    res.json({ message: 'GPU upgraded', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add referral
router.post('/add-referral', async (req, res) => {
  try {
    const { referredId } = req.body;
    const referrer = await User.findOne({ telegramId: req.user.telegramId });
    const referred = await User.findOne({ telegramId: referredId });

    if (!referrer || !referred) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (referred.referredBy) {
      return res.status(400).json({ message: 'User already referred' });
    }

    referrer.referrals.push(referred._id);
    referred.referredBy = referrer._id;

    // Update referral chain
    const referralChain = [referrer._id, ...referrer.referralChain];
    referred.referralChain = referralChain.slice(0, 10); // Limit to 10 levels

    // Distribute XP to referral chain
    let xpToDistribute = 1000;
    for (let i = 0; i < referralChain.length; i++) {
      const chainUser = await User.findById(referralChain[i]);
      const xpShare = Math.floor(xpToDistribute * 0.1);
      chainUser.xp += xpShare;
      await chainUser.save();
      xpToDistribute -= xpShare;
    }

    await referrer.save();
    await referred.save();

    res.json({ message: 'Referral added successfully', referrer, referred });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;