const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ telegramId: decoded.id });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if token is blacklisted (for logout functionality)
    // const isBlacklisted = await TokenBlacklist.findOne({ token });
    // if (isBlacklisted) throw new Error('Token is no longer valid');

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired.' });
    }
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
module.exports = auth;
