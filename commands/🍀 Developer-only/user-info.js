const { EmbedBuilder } = require('discord.js');
const { ownerIds } = require('../../config');

module.exports = {
  usage: 'cp user-info <user_id>',
  name: 'user-info',
  aliases: ['ui'],
  description: 'Displays information about a user (owner only).',
  async execute({ msg, args }) {
    try {
      if (!ownerIds.includes(msg.author.id)) return;

      // Get the user ID from command arguments
      const userId = args[0];
      if (!userId) {
        return msg.reply('Please provide a user ID.');
      }

      // Fetch the user from Discord
      const user = await msg.client.users.fetch(userId);

      // Get the guilds the user is in
      const userGuilds = msg.client.guilds.cache.filter(guild => guild.members.cache.has(user.id));

      // Create an embed to display user information
      const userInfoEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('User Information')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Username', value: `${user.username}`, inline: true },
          { name: 'User ID', value: `${user.id}`, inline: true },
          { name: 'Display Name', value: `${user.displayName}`, inline: true },
          { name: 'Guilds', value: userGuilds.map(guild => `${guild.name} - ${guild.description}`).join('\n') || 'None', inline: false }
        );

      msg.channel.send({ embeds: [userInfoEmbed] });
    } catch (error) {
      console.error('An error occurred while fetching user information:', error);
      msg.reply('An error occurred while fetching user information.');
    }
  },
};