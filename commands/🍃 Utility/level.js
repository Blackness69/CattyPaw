const Level = require('../../Schemas/economy/levelSchema');
const User = require('../../Schemas/economy/userSchema');
const { AttachmentBuilder } = require('discord.js');
const canvafy = require('canvafy');
const { getPrefix } = require('../../config');

module.exports = {
  usage: 'cp level <user>',
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
        return msg.reply(`**${targetUser.displayName}** doesn't have a account yet.`);
      }

      const user = await Level.findOne({ userId: targetUser.id });
      if (!user) {
        return msg.reply(`**${targetUser.displayName}** doesn't have a level yet. Try using \`\`cp level\`\` command again to see your level.`);
      }

      const avatarURL = targetUser.displayAvatarURL({ format: 'jpg' });
      const xpNeededForNextLevel = 360 + (user.level - 1) * 360;

      let backgroundImageURL = 'https://cdn.discordapp.com/attachments/1233782937795821660/1236226541831327795/20240504_140236.jpg?ex=66373d2f&is=6635ebaf&hm=364cce8dab41ec6873d50e7d1680c01568bf9db1172498949a0bae3ebaef9895&'; // Set your background image URL here if needed

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