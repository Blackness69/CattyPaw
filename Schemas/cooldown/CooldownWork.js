// Schema: CooldownWork.js
const mongoose = require('mongoose');

const workCooldownSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  cooldownExpiration: {
    type: Date,
    default: Date.now,
  },
});

const Cooldown = mongoose.model('WorkCooldown', workCooldownSchema);

module.exports = Cooldown;
