// prefix.js
const { getPrefix } = require('../../config.js');
const prefixSchema = require('../../Schemas/economy/prefixSchema');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'prefix',
  description: 'Change the bot prefix',
  async execute({ args, msg }) {

    const newPrefix = args[0];
    if (!newPrefix) {
      const currentPrefix = await getPrefix(msg.guild.id);
      return msg.reply(`The current prefix for this server is: \`\`${currentPrefix}\`\``);
    }

    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return msg.reply('You do not have admin permission to use this command.');
    }

    try {
      let prefixData = await prefixSchema.findOne({ guildId: msg.guild.id });

      if (!prefixData) {
        prefixData = await prefixSchema.create({
          guildId: msg.guild.id,
          prefix: newPrefix
        });
      } else {
        if (prefixData.prefix === newPrefix) {
          return msg.reply(`The prefix "${newPrefix}" is already set in this server.`);
        }
      }

      prefixData.prefix = newPrefix;
      await prefixData.save();

      return msg.reply(`Prefix has been changed to ${newPrefix}`);
    } catch (error) {
      console.error('Error changing prefix:', error);
      return msg.reply('An error occurred while changing the prefix.');
    }
  },
};