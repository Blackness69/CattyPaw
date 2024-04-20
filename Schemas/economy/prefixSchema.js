// prefixSchema.js

const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    default: 'cp', // Default prefix
  },
});

module.exports = mongoose.model('Prefix', prefixSchema);