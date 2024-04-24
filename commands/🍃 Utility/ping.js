const { getPrefix } = require('../../config');
const prefix = getPrefix(msg.guild.id);

module.exports = {
  usage: `${prefix} ping`,
  name: 'ping',
  description: 'Shows the bot\'s ping.',
  async execute({msg, client}) {
    msg.reply(`🏓 | Pong! **${Date.now() - msg.createdTimestamp}**ms.`);
  },
};