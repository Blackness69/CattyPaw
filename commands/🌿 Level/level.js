const Level = require('../../Schemas/economy/levelSchema');
const User = require('../../Schemas/economy/userSchema');
const { AttachmentBuilder } = require('discord.js');
const canvafy = require('canvafy');
const { getPrefix } = require('../../config');

module.exports = {
  name: 'level',
  aliases: ['xp', 'lvl'],
  description: 'Check your level or mentioned user\'s level.',
  async execute({ msg }) {
    try {
      const prefix = getPrefix(msg.guild.id);
      // Extract the mentioned user if any
      let targetUser = msg.author;
      const mentionedUser = msg.mentions.members.first();
      if (mentionedUser) {
        targetUser = mentionedUser;
      }
      
      // Find the user's level data
      const userData = await User.findOne({ userId: targetUser.id });
      if (!userData) {
        return msg.reply(`${targetUser.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`${prefix} start\`? 🌟`);
      }

      const user = await Level.findOne({ userId: targetUser.id });
      if (!user) {
        return msg.reply(`**${targetUser.displayName}** doesn't have a level yet. Try using \`\`${prefix} level\`\` command again to see your level.`);
      }

      const avatarURL = targetUser.displayAvatarURL({ format: 'jpg' });
      const xpNeededForNextLevel = 360 + (user.level - 1) * 360;

      let backgroundImageURL = 'https://cdn.discordapp.com/attachments/1209078672993165312/1231482598358908968/images_1_3.jpg?ex=66371e8b&is=6624a98b&hm=da84ff6ce1bb8c1e457a9f2c87f5ff1d57d3f41ad42b74afffc82a2d2ee5842c&'; // Set your background image URL here if needed

      // Sort all users by level
      const allUsers = await Level.find();
      allUsers.sort((a, b) => b.level - a.level);
      const userRank = allUsers.findIndex(u => u.userId === targetUser.id) + 1;

      // Generate the rank image
      const rank = await new canvafy.Rank()
        .setAvatar(avatarURL)
        .setBackground('image', backgroundImageURL)
        .setUsername(userData.userName)
        .setBorder('#ffffff')
        .setBarColor('#0000ff')
        .setLevel(user.level)
        .setRank(userRank)
        .setCurrentXp(user.xp)
        .setRequiredXp(xpNeededForNextLevel)
        .build();

      // Reply with the rank image
      return msg.reply({
        files: [new AttachmentBuilder(rank, `rank-${targetUser.id}.png`)]
      })

    } catch (error) {
      console.error('Error', error);
      return msg.reply('An error occurred while processing your request.');
    }
  },
};