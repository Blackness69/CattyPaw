const { ownerIds } = require('../../config');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'reset-balance',
  aliases: ['rb', 'reset-cash', 'reset-coins', 'rc'],
  description: 'Reset the balance of a user',
  async execute({ msg }) {
    // Check if the command is being executed by an owner
    if (!ownerIds.includes(msg.author.id)) return;

    let user = msg.mentions.members.first();
    if (!user) {
      user = msg.author;
    }

    try {
      // Find the user's balance document
      let userData = await User.findOne({ userId: user.id });

      // If the user has a balance document, reset their balance to 0
      if (userData) {
        await userData.updateOne({ balance: 0 });
        msg.reply(`Successfully reset the balance of **${user.displayName}**.`);
      } else {
        msg.reply(`**${user.displayName}** doesn't have a account yet.`);
      }
    } catch (error) {
      console.error('Error resetting balance:', error);
      msg.reply('An error occurred while resetting the balance.');
    }
  }
};