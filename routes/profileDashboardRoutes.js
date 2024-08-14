const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quest = require('../models/Quest');

// Get user profile and dashboard data
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId })
      .populate('referredBy', 'username')
      .populate('referrals', 'username');

    const activeQuests = await Quest.find({ expiresAt: { $gt: new Date() } });

    const dashboardData = {
      user: {
        username: user.username,
        xp: user.xp,
        compute: user.compute,
        computePower: user.computePower,
        totalTaps: user.totalTaps,
        referredBy: user.referredBy ? user.referredBy.username : null,
        referrals: user.referrals.map(r => r.username),
        lastDailyClaimDate: user.lastDailyClaimDate,
      },
      quests: activeQuests,
      cooldownStatus: user.cooldownEndTime > Date.now() ? {
        cooling: true,
        remainingTime: Math.ceil((user.cooldownEndTime - Date.now()) / 1000)
      } : { cooling: false },
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/update', async (req, res) => {
  try {
    const allowedUpdates = ['username'];
    const updates = Object.keys(req.body)
      .filter(update => allowedUpdates.includes(update))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findOneAndUpdate(
      { telegramId: req.user.telegramId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;