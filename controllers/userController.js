const User = require('../models/User');
const { handleServerError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const crypto = require('crypto');
const config = require('../config');

const verifyTelegramWebAppData = (initData) => {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(config.telegramBotToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
};

exports.authenticateTelegram = async (req, res) => {
  try {
    const telegramData = req.header('Telegram-Data');
    const { id, name, avatarUrl } = req.body;

    if (!verifyTelegramWebAppData(telegramData)) {
      logger.warn(`Invalid Telegram data attempt: ${id}`);
      return res.status(401).json({ message: 'Invalid Telegram data' });
    }

    let user = await User.findOneAndUpdate(
      { telegramId: id },
      { 
        $set: { 
          username: name,
          avatarUrl: avatarUrl
        },
        $setOnInsert: { telegramId: id }
      },
      { new: true, upsert: true, runValidators: true }
    );

    const token = user.generateAuthToken();

    res.json({
      token,
      user: {
        id: user.telegramId,
        username: user.username,
        xp: user.xp
      }
    });
    logger.info(`User authenticated: ${id}`);
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'avatarUrl', 'language', 'theme'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      logger.warn(`Invalid update attempt: ${req.user._id}`);
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user);
    logger.info(`Profile updated: ${req.user._id}`);
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    handleServerError(res, error);
  }
};

exports.claimDailyXP = async (req, res) => {
  try {
    if (req.user.canClaimDailyXP()) {
      const xpGained = 500;
      req.user.xp += xpGained;
      req.user.lastDailyClaimDate = new Date();
      req.user.checkInStreak += 1;
      await req.user.save();
      res.json({ message: 'Daily XP claimed successfully', xpGained, newTotalXp: req.user.xp });
      logger.info(`Daily XP claimed: ${req.user._id}`);
    } else {
      logger.warn(`Attempted to claim XP too soon: ${req.user._id}`);
      res.status(400).json({ message: 'Daily XP already claimed' });
    }
  } catch (error) {
    logger.error(`Claim daily XP error: ${error.message}`);
    handleServerError(res, error);
  }
};

exports.tap = async (req, res) => {
  try {
    const now = new Date();
    if (req.user.cooldownEndTime && now < req.user.cooldownEndTime) {
      return res.status(400).json({ 
        message: 'GPU is cooling down', 
        cooldownEndTime: req.user.cooldownEndTime
      });
    }

    req.user.totalTaps += 1;
    req.user.compute += req.user.computePower;
    req.user.lastTapTime = now;

    if (req.user.totalTaps % 1000 === 0) {
      req.user.cooldownEndTime = new Date(now.getTime() + 5 * 60 * 1000);
    }

    await req.user.save();

    res.json({ 
      message: 'Tap successful', 
      user: {
        compute: req.user.compute,
        totalTaps: req.user.totalTaps,
        computePower: req.user.computePower,
        cooldownEndTime: req.user.cooldownEndTime
      }
    });
    logger.info(`Successful tap: ${req.user._id}`);
  } catch (error) {
    logger.error(`Tap error: ${error.message}`);
    handleServerError(res, error);
  }
};

exports.getCooldownStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      cooldownEndTime: user.cooldownEndTime,
      isCoolingDown: user.cooldownEndTime > Date.now()
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.getDailyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ dailyPoints: user.dailyPoints });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.upgradeGPU = async (req, res) => {
  // Implementation...
};
