const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Shows the bot\'s ping'),
  async execute({interaction}) {
    interaction.reply(`🏓 | Pong! **${Date.now() - interaction.createdTimestamp}**ms.`);
  },
};