const { currency, ownerIds } = require('../../config');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'add-coins',
  aliases: ['ac'],
  description: 'Add coins to a user',
  async execute({ msg, args, client }) {
    if (!ownerIds.includes(msg.author.id)) return;
    // ensure the user is mentioned or fetch by ID
    const user = msg.mentions.members.first() || await client.users.fetch(args[0]);

    if (!user) return msg.reply('Please provide a valid user to remove coins.');
    // Define the maximum limit for removal
    const maxLimit = 10000000;
    // Parse the amount from arguments
    const amount = parseInt(args[1]);

    // Check if the amount is valid
    if (!amount || amount < 0 || amount > maxLimit) {
      return msg.reply(`Please provide a valid amount of coins. You can add 1 to ${maxLimit.toLocaleString()} CP coins.`);
    }

    // Fetch the user's balance from the database
    const existingUser = await User.findOne({ userId: user.id });
    // Check if the user has an account
    if (!existingUser) return msg.reply(`**${user.displayName}** doesn't have an account yet.`);

    // Update the user's balance by 
    await User.updateOne({ userId: user.id }, { $inc: { balance: amount } });

    msg.reply(`Successfully added **__${amount.toLocaleString()}__** ${currency} CP coins to **${user.displayName}**'s balance.`);
  }
};