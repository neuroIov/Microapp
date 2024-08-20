const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    let query = {};
    let sort = {};

    switch (type) {
      case 'daily':
        query = { lastTapTime: { $gte: new Date(Date.now() - 24*60*60*1000) } };
        sort = { compute: -1 };
        break;
      case 'weekly':
        query = { lastTapTime: { $gte: new Date(Date.now() - 7*24*60*60*1000) } };
        sort = { compute: -1 };
        break;
      case 'all-time':
        sort = { computePower: -1, compute: -1 };
        break;
      default:
        return res.status(400).json({ message: 'Invalid leaderboard type' });
    }

    const leaderboard = await User.find(query)
      .sort(sort)
      .limit(100)
      .select('username computePower compute');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/position/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let query = {};
    let sort = {};

    switch (type) {
      case 'daily':
        query = { 
          lastTapTime: { $gte: new Date(Date.now() - 24*60*60*1000) },
          compute: { $gt: user.compute }
        };
        break;
      case 'weekly':
        query = { 
          lastTapTime: { $gte: new Date(Date.now() - 7*24*60*60*1000) },
          compute: { $gt: user.compute }
        };
        break;
      case 'all-time':
        query = { 
          $or: [
            { computePower: { $gt: user.computePower } },
            { computePower: user.computePower, compute: { $gt: user.compute } }
          ]
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid leaderboard type' });
    }

    const position = await User.countDocuments(query) + 1;
    const totalUsers = await User.countDocuments();

    res.json({ position, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
