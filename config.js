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
  ownerIds: ["1081995719210172497", "1229341293176557570", "1153611682250227764"], // Array of owner IDs
  avatarURL: "",
  currency: "<:cattypal:1233779228617740309>",
  coinflip: "<a:coinflip:1233779307302621267>",
  coinflip2: "<:coinflip2:1233779443001200670>",
  mongoURL: "mongodb+srv://Blackness36:Blackness697@cattypal.931cn9t.mongodb.net/",
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};