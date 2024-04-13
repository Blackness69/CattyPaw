const User = require('../../Schemas/economy/userSchema');
const { currency, prefix, ownerIds } = require('../../config.js');

module.exports = {
  name: 'addcoins',
  aliases: ['ac'],
  description: 'Add CP coins to a specific user',
  async execute({msg, args}) {
    if (msg.author.id !== ownerIds) return msg.reply('⚠️ | You are not authorized to use this command.');
    
    if (!args[0]) {
        return msg.reply(`Wrong argument! Usage: \`\`${prefix} addcpcoins <user> <amount>\`\``);
    }
    
    const member = msg.mentions.members.first() || msg.author;
    const userId = member.id;
    
    const user = await User.findOne({ userId });

    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) {
        return msg.reply('Amount must be a positive number');
    }

    user.balance += amount;
    await user.save();

await msg.reply(`Successfully added **__${amount.toLocaleString()}__** to ${member.displayName}'s account balance.`);
  }
}