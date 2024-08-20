const crypto = require('crypto');

// Generate a unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Validate a referral code (simple example, you might want to add more complex validation)
const validateReferralCode = (code) => {
  // Check if the code is a string and has the correct length (8 characters in this case)
  return typeof code === 'string' && code.length === 8 && /^[0-9A-F]{8}$/.test(code);
};

module.exports = {
  generateReferralCode,
  validateReferralCode
};
