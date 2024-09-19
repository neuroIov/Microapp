const User = require('../models/User');
const { verifyTelegramWebAppData } = require('../utils/telegramUtils');
const logger = require('../utils/logger');

exports.authenticateTelegram = async (req, res) => {
  try {
    const initData = req.body.initData || req.headers['x-telegram-init-data'];
    
    if (!initData) {
      return res.status(400).json({ message: 'Telegram init data is missing' });
    }

    if (!verifyTelegramWebAppData(initData)) {
      return res.status(401).json({ message: 'Invalid Telegram data' });
    }

    const parsedInitData = new URLSearchParams(initData);
    const userData = JSON.parse(parsedInitData.get('user'));

    let user = await User.findOneAndUpdate(
      { telegramId: userData.id },
      { 
        $set: { 
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          languageCode: userData.language_code,
          photoUrl: userData.photo_url
        },
        $setOnInsert: { telegramId: userData.id }
      },
      { new: true, upsert: true }
    );

    const token = user.generateAuthToken();

    res.json({
      token,
      user: {
        id: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        languageCode: user.languageCode,
        photoUrl: user.photoUrl,
        xp: user.xp
      }
    });
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
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
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.canClaimDailyXP()) {
      const xpGained = 500;
      user.xp += xpGained;
      user.lastDailyClaimDate = new Date();
      user.checkInStreak += 1;
      await user.save();
      res.json({ message: 'Daily XP claimed successfully', xpGained, newTotalXp: user.xp });
    } else {
      res.status(400).json({ message: 'Daily XP already claimed' });
    }
  } catch (error) {
    console.error('Claim daily XP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
