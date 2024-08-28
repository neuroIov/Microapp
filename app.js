const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const TelegramBot = require('node-telegram-bot-api');
const jwt = require('jsonwebtoken');
const prometheus = require('prom-client');
const crypto = require('crypto');

const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const User = require('./models/User');  // Import the User model

const userRoutes = require('./routes/userRoutes');
const questRoutes = require('./routes/questRoutes');

const leaderboardRoutes = require('./routes/leaderboardRoutes');
const profileDashboardRoutes = require('./routes/profileDashboardRoutes');
const referralRoutes = require('./routes/referralRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(bodyParser.json());
app.use(rateLimiter);

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Telegram Bot setup
const bot = new TelegramBot(config.telegramBotToken, { polling: false });

// JWT middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authentication token is required' });
  }
};

// Prometheus metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Middleware to collect HTTP metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Expose metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Routes
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/quests', authenticateJWT, questRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', authenticateJWT, leaderboardRoutes);
app.use('/api/profile-dashboard', authenticateJWT, profileDashboardRoutes);
app.use('/api/referral', authenticateJWT, referralRoutes);
app.use('/api/settings', settingsRoutes);

// Telegram auth route
app.post('/auth/telegram', async (req, res) => {
  try {
    const { id, first_name, username } = req.body;
    
    // Find or create user
    let user = await User.findOne({ telegramId: id });
    if (!user) {
      user = new User({
        telegramId: id,
        username: username || first_name, // Use username if available, otherwise first_name
      });
      await user.save();
      logger.info('New user created:', user);
    } else {
      logger.info('Existing user found:', user);
    }

    // Create token
    const token = jwt.sign(
      { id: user.telegramId, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.telegramId, username: user.username } });
  } catch (error) {
    logger.error('Error in /auth/telegram:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing HTTP server.');
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

const PORT = config.port;
const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
