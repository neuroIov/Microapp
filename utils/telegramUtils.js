const crypto = require('crypto');
const config = require('../config');

exports.verifyTelegramWebAppData = (data) => {
  const { hash, ...dataToCheck } = data;
  
  const checkString = Object.keys(dataToCheck)
    .sort()
    .map(key => `${key}=${dataToCheck[key]}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(config.telegramBotToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

  return calculatedHash === hash;
};