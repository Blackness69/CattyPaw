const User = require('../../Schemas/economy/userSchema');
const { currency } = require('../../config');

module.exports = {
  usage: 'cp top-cash <limit>',
  name: 'top-cash',
  aliases: ['topcash', 'top-c', 'topc'],
  description: 'Display the top users based on their balance.',
  async execute({ msg, args }) {
    try {
      let limit = 10;
      if (args[0]) {
        limit = parseInt(args[0]);
        if (isNaN(limit) || limit <= 0 || limit > 100) {
          return msg.reply('Please provide a valid limit of users (1-100) to display.');
        }
      }
      const topUsers = await User.find().sort({ balance: -1 }).limit(limit);

      if (topUsers.length === 0) {
        return msg.reply('No users found.');
      }

      // Find the author's rank
      const authorIndex = topUsers.findIndex(user => user.userId === msg.author.id);
      const authorRank = authorIndex !== -1 ? authorIndex + 1 : 'N/A';

      let leaderboard = `Top ${limit} Global Users by Balance:\nYour rank is #${authorRank}\n\n`;

      for (let i = 0; i < topUsers.length; i++) {
        const user = await msg.client.users.fetch(topUsers[i].userId);
        if (!user) continue; 

        leaderboard += `#${i + 1}. **${user.username}** - **__${topUsers[i].balance.toLocaleString()}__** ${currency} CP coins\n--------------------------------------------\n`;
      }

      msg.channel.send(leaderboard);
    } catch (error) {
      console.error('An error occurred while fetching top users:', error);
      msg.reply('An error occurred while fetching top users.');
    }
  },
};