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
    const amount = parseInt(args[1]);

    if (!amount || amount < 0) {
      return msg.reply('Please provide a valid amount of coins.');
    }

    const existingUser = await User.findOne({ userId: user.id });
    if (!existingUser) return msg.reply(`**${user.displayName}** doesn't have a account yet.`);

    await existingUser.findOneAndUpdate(
      { userId: user.id },
      { $inc: { balance: amount } },
    )

    msg.reply(`Successfully added **__${amount.toLocaleString()}__** ${currency} CP coins to **${user.displayName}**'s balance.`);
  }
}