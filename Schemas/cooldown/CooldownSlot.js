const { model, Schema } = require('mongoose');

const slotCooldownSchema = new Schema({
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

const Cooldown = model('SlotCooldown', slotCooldownSchema);

module.exports = Cooldown;