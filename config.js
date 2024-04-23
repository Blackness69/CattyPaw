// config.js
const { readFileSync } = require('fs');
const prefixSchema = require('./Schemas/economy/prefixSchema');

async function getPrefix(guildId) {
  const prefixData = await prefixSchema.findOne({ guildId });
  return prefixData ? prefixData.prefix : "cp"; // Default prefix 'cp'
}

module.exports = {
  token: process.env.token || readFileSync('token.txt', 'utf-8'),
  getPrefix, // Exporting the function to fetch prefix dynamically
  clientId: process.env.CLIENT_ID,
  ownerIds: ["1081995719210172497", "1229341293176557570"], // Array of owner IDs
  avatarURL: "",
  currency: "<:cattypal:1232348823729213470>",
  coinflip: "<a:coinflip:1232349729128579143>",
  coinflip2: "<:coinflip2:1232351041186697246>",
  mongoURL: "mongodb+srv://Blackness36:Blackness697@cattypal.931cn9t.mongodb.net/",
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};