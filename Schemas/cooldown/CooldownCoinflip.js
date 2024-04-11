const { model, Schema } = require('mongoose');

const coinflipCooldownSchema = new Schema({
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

const Cooldown = model('CoinflipCooldown', coinflipCooldownSchema);

module.exports = Cooldown;