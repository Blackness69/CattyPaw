const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
  },
  balance: {
    type: Number,
  },
});

const User = model('User', userSchema)

module.exports = User;