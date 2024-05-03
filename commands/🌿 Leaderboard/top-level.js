const Level = require('../../Schemas/economy/levelSchema');
const { getPrefix } = require('../../config');
const { Top } = require('canvafy');

module.exports = {
    usage: 'cp top level',
    name: 'top-level',
    aliases: ['toplevel', 'top-l', 'topl'],
    description: 'Display the top 10 users globally based on their levels.',
  async execute({msg}) {

    try {
      const topUsers = await Level.find({}).sort({ level: -1 }).limit(10);

      if (topUsers.length > 0) {
        const usersData = await Promise.all(topUsers.map(async (user, index) => {
          // Fetch Discord user data
          let member;
          try {
            member = await msg.client.users.fetch(user.userId);
          } catch (error) {
            console.error(`User not found: ${user.userId}`);
            return null;
          }

          // Use the username and avatar of the member
          const username = member.username;
          const avatar = member.displayAvatarURL({ format: 'png', dynamic: true, size: 128 });

          return {
            top: index + 1,
            avatar: avatar,
            tag: `${username}`,
            score: user.level, // Assuming level is the score
          };
        }));

        // Filter out null entries (users not found)
        const filteredUsersData = usersData.filter(user => user !== null);

        const top = await new Top()
          .setOpacity(0.6)
          .setScoreMessage('Level:')
          .setabbreviateNumber(false)
          .setBackground('image', 'https://cdn.discordapp.com/attachments/1233782937795821660/1235898400554221620/20240503_161800.jpg?ex=66360b94&is=6634ba14&hm=96f9900b3a3ab93cba62e17b6a33ee1c797d877700af3266ae8f2928aeff0cb0&')
          .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
          .setUsersData(filteredUsersData)
          .build();

        msg.reply({
          files: [{
            attachment: top,
            name: `top-${msg.author.id}.png`,
          }],
        });
      } else {
        msg.reply('No users found.');
      }
    } catch (error) {
      console.error('Error fetching top users:', error);
      msg.reply('An error occurred while fetching top users.');
    }
  },
};
