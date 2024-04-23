const { grantXP } = require('../../handlers/xpHandler');
const {ownerIds} = require('../../config');

module.exports = {
  name: 'add-xp',
  aliases: ['ax'],
  description: 'Add XP to a user',
  async execute({msg, args}) {
    if (!ownerIds.includes(msg.author.id)) return;

    const user = msg.mentions.members.first();
    if (!user) return msg.reply('Please mention a user');

    const userId = user.id;

    const amount = parseInt(args[1]);
    if (!amount || amount < 0) {
      return msg.reply('Please provide a valid XP in number');
    }

    const xpToAdd = amount;
    await grantXP(userId, amount);

    msg.reply(`Successfully added **${amount}** XP to **${user.displayName}**'s level`);
  },
};