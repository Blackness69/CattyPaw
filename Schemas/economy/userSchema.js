const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  userName: String,
  balance: {
    type: Number,
    default: 0
  },
});

const User = model('User', userSchema);

module.exports = User;