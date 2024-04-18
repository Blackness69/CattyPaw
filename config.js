const {readdirSync} = require('fs')
module.exports = {
  prefix: "cp",
  token: process.env.token || readdirSync('token.txt', 'utf-8'),
  clientId: process.env.CLIENT_ID,
  ownerIds: "1081995719210172497",
  avatarURL: "",
  currency: "<:cattypaw:1227841175671541801>",
  mongoURL: process.env.mongoURL || readdirSync('mongoURL.txt', 'utf-8'),
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};