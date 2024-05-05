const { ownerIds } = require('../../config');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'account-created',
  aliases: ['acc-created', 'acc', 'acc-cr'],
  description: 'See if the user account is created or not.',
  async execute({ msg, args, client }) {
    if (!ownerIds.includes(msg.author.id)) return;

    const user = msg.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return msg.channel.send('User not found');
    }

    const userData = await User.findOne({ userId: user.id });
    const emoji = userData ? '✅' : '❌';

    msg.reply(`'s account created: ${emoji}`);
  },
};