const { Schema, model } = require('mongoose');

const bankSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  }
});

module.exports = model('Bank', bankSchema);