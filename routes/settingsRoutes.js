const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const settings = {
      notifications: user.notifications || true,
      language: user.language || 'en',
      theme: user.theme || 'dark'
    };

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { notifications, language, theme } = req.body;
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (notifications !== undefined) user.notifications = notifications;
    if (language) user.language = language;
    if (theme) user.theme = theme;

    await user.save();

    res.json({ message: 'Settings updated successfully', settings: { notifications: user.notifications, language: user.language, theme: user.theme } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
