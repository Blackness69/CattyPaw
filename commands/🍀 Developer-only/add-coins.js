const { currency, ownerIds } = require('../../config');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'add-coins',
  aliases: ['ac'],
  description: 'Add coins to a user',
  async execute({msg, args}) {
    if (!ownerIds.includes(msg.author.id)) return;
    const user = msg.mentions.members.first();
    if (!user) return msg.reply('Please mention a user');
    const userId = user.id;
    const amount = parseInt(args[1]);

    if (!amount || amount < 0) {
      return msg.reply('Please provide a valid amount of coins.');
    }

    await User.findOneAndUpdate(
      { userId: userId },
      { $inc: { balance: amount } },
    )

    msg.reply(`Successfully added **__${amount.toLocaleString()}__** ${currency} CP coins to **${user.displayName}**'s balance.`);
  }
}