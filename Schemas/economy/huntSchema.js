// Schema: Hunt.js
const mongoose = require('mongoose');

const HuntSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  huntedAnimals: {
    type: [String],
    default: [],
  },
});

const Hunt = mongoose.model('Hunt', HuntSchema);

module.exports = Hunt;