const User = require('../../Schemas/economy/userSchema');
const { EmbedBuilder } = require('discord.js');
const { currency } = require('../../config');

module.exports = {
  usage: 'cp top-cash <limit>',
  name: 'top-cash',
  aliases: ['topcash', 'top-c', 'topc'],
  description: 'Display the top users based on their balance.',
  async execute({ msg, args }) {
    try {
      let limit = 5;
      if (args[0]) {
        limit = parseInt(args[0]);
        if (isNaN(limit) || limit <= 0 || limit > 25) {
          return msg.reply('Please provide a valid limit of users (1-25) to display.');
        }
      }
      const topUsers = await User.find().sort({ balance: -1 }).limit(limit);

      if (topUsers.length === 0) {
        return msg.reply('No users found.');
      }

      // Find the author's rank
      const authorData = await User.findOne({ userId: msg.author.id });
      const authorRank = authorData ? await User.countDocuments({ balance: { $gt: authorData.balance } }) + 1 : 'N/A';

      const leaderboard = new EmbedBuilder()
        .setTitle(`Top ${limit} Global Users by Balance`)
        .setColor('#0000ff')
        .setDescription(`Your rank: #${authorRank}`)
        .setTimestamp();

      for (let i = 0; i < topUsers.length; i++) {
        const user = await msg.client.users.fetch(topUsers[i].userId);
        if (!user) continue;

        leaderboard.addFields(
          { name: `#${i + 1}. ${user.username}`, value: `Balance: **__${topUsers[i].balance.toLocaleString()}__** ${currency} CP coins`, inline: true },
        )
      }

      msg.reply({ embeds: [leaderboard] });
    } catch (error) {
      console.error('An error occurred while fetching top users:', error);
      msg.reply('An error occurred while fetching top users.');
    }
  },
};