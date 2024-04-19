const {readFileSync} = require('fs')
module.exports = {
  prefix: "cp",
  token: process.env.token || readFileSync('token.txt', 'utf-8'),
  clientId: process.env.CLIENT_ID,
  ownerIds: "1081995719210172497",
  avatarURL: "",
  currency: "<:cattypaw:1227841175671541801>",
  mongoURL: "mongodb+srv://Blackness36:Blackness697@cattypal.931cn9t.mongodb.net/",
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};