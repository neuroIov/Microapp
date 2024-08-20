const Joi = require('joi');

const userSchema = Joi.object({
  telegramId: Joi.string().required(),
  username: Joi.string().required(),
  xp: Joi.number().min(0),
  compute: Joi.number().min(0),
  computePower: Joi.number().min(1),
  // Add other fields as necessary
});

module.exports = {
  validateUser: (data) => userSchema.validate(data),
};