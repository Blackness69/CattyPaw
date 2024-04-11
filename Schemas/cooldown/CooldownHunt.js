const { model, Schema } = require('mongoose');

const huntCooldownSchema = new Schema({
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

const Cooldown = model('HuntCooldown', huntCooldownSchema);

module.exports = Cooldown;