const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      { $sort: { computePower: -1, compute: -1 } },
      { $limit: 100 },
      { $project: { username: 1, computePower: 1, compute: 1, _id: 0 } }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's position in the leaderboard
router.get('/position', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const position = await User.countDocuments({
      $or: [
        { computePower: { $gt: user.computePower } },
        { computePower: user.computePower, compute: { $gt: user.compute } }
      ]
    }) + 1;

    res.json({ position, totalUsers: await User.countDocuments() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard for a specific timeframe (daily, weekly, monthly)
router.get('/:timeframe', async (req, res) => {
  try {
    const { timeframe } = req.params;
    let startDate;

    switch (timeframe) {
      case 'daily':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ message: 'Invalid timeframe' });
    }

    const leaderboard = await User.aggregate([
      { $match: { lastTapTime: { $gte: startDate } } },
      { $sort: { computePower: -1, compute: -1 } },
      { $limit: 100 },
      { $project: { username: 1, computePower: 1, compute: 1, _id: 0 } }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;