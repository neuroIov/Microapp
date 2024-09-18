const User = require('../models/User');
const { handleServerError } = require('../middleware/errorHandler');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authenticateTelegram = async (req, res) => {
  try {
    const { id, first_name, username, photo_url, auth_date, hash } = req.body;
    
    // Verify the authentication data
    const secretKey = crypto.createHash('sha256')
      .update(config.telegramBotToken)
      .digest();
    const dataCheckString = Object.keys(req.body)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${req.body[key]}`)
      .join('\n');
    const hmac = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    if (hmac !== hash) {
      return res.status(401).json({ error: 'Invalid authentication data' });
    }

    // Check if auth_date is not older than 1 hour
    const now = Math.floor(Date.now() / 1000);
    if (now - auth_date > 3600) {
      return res.status(401).json({ error: 'Authentication data expired' });
    }

    let user = await User.findOneAndUpdate(
      { telegramId: id },
      { 
        $set: { 
          username: username || first_name,
          avatarUrl: photo_url
        },
        $setOnInsert: { telegramId: id }
      },
      { new: true, upsert: true }
    );

    const token = jwt.sign({ id: user.telegramId }, config.jwtSecret, { expiresIn: '7d' });

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    handleServerError(res, error);
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
