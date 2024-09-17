const { body, validationResult } = require('express-validator');

exports.validateUser = [
  body('username').optional().isString().trim().isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('avatarUrl').optional().isURL().withMessage('Invalid avatar URL'),
  body('language').optional().isIn(['en', 'ru']).withMessage('Invalid language selection'),
  body('theme').optional().isIn(['light', 'dark']).withMessage('Invalid theme selection'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateTelegramAuth = [
  body('id').isString().notEmpty().withMessage('Telegram ID is required'),
  body('first_name').optional().isString().withMessage('First name must be a string'),
  body('username').optional().isString().withMessage('Username must be a string'),
  body('photo_url').optional().isURL().withMessage('Invalid photo URL'),
  body('auth_date').isInt().withMessage('Invalid authentication date'),
  body('hash').isString().notEmpty().withMessage('Hash is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];