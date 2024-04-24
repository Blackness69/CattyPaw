// resetPrefix.js
const prefixSchema = require('../../Schemas/economy/prefixSchema');
const { getPrefix } = require('../../config');
const { PermissionsBitField } = require('discord.js');
const prefix = getPrefix(msg.guild.id);

module.exports = {
  usage: `${prefix} reset-prefix`,
  name: 'reset-prefix',
  description: 'Reset the custom prefix for the bot in the current server.',
  async execute({ msg }) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return msg.reply('You do not have admin permission to use this command.');
    }
    
    try {
      const prefixData = await prefixSchema.findOneAndDelete({ guildId: msg.guild.id });

      if (!prefixData) {
        return msg.reply('There is no custom prefix set in this server.');
      }

      return msg.reply('Custom prefix has been reset to default.');
    } catch (error) {
      console.error('Error resetting prefix:', error);
      return msg.reply('An error occurred while resetting the prefix.');
    }
  },
};