require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name',
  jwtSecret: process.env.JWT_SECRET,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '7220785507:AAHZxPT0YbdobIzWu-Ikmm46kbhIKSXIcss',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};