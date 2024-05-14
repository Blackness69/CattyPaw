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
  clientId: process.env.clientId || "1229438321395109929",
  ownerIds: ["1081995719210172497", "1229341293176557570", "1153611682250227764", "1143546241922383954"], // Array of owner IDs
  topggBotApiKey: process.env.topggBotApiKey || readFileSync('topggBotApiKey.txt', 'utf-8'),
  bannedPrefix: ["<@1229438321395109929>", "c"],
  currency: "<:cattypal:1233779228617740309>",
  coinflip: "<a:coinflip:1233779307302621267>",
  coinflip2: "<:coinflip2:1233779443001200670>",
  mongoURL: process.env.mongoURL || readFileSync('mongoURL.txt', 'utf-8'),
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};