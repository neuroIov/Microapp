const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');

// Get all active quests
router.get('/', async (req, res) => {
  try {
    const quests = await Quest.find({ expiresAt: { $gt: new Date() } });
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add more quest-related routes here

module.exports = router;