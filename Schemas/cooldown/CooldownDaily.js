const { model, Schema } = require('mongoose');

const dailyCooldownSchema = new Schema({
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  cooldownExpiration: {
    type: Number,
    required: true,
  },
});

const Cooldown = model('DailyCooldown', dailyCooldownSchema);

module.exports = Cooldown;