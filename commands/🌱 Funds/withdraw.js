const UserAccount = require('../../Schemas/economy/userSchema');
const Bank = require('../../Schemas/economy/bankSchema');
const { currency, getPrefix } = require('../../config.js');

module.exports = {
  usage: 'cp withdraw <amount>',
  name: 'withdraw',
  aliases: ['with'],
  description: 'Withdraw CP coins from your bank.',
  async execute({msg, args}) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await UserAccount.findOne({ userId: msg.author.id });
      if (!user) {
        return msg.reply(`**${targetUser.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`cp start\`? 🌟`);
      }

      const amount = parseInt(args[0]);

      if (isNaN(amount) || amount <= 0) {
        return msg.reply('Please enter a valid amount to withdraw.');
      }

      let bank = await Bank.findOne({ userId: msg.author.id });
      if (!bank) {
        return msg.reply(`You don\'t have a bank account yet. Use the \`\`${prefix} bank\`\` command to create one.`);
      }

      if (amount > bank.balance) {
        return msg.reply(`You don't have enough ${currency} CP coins in your bank to withdraw.`);
      }

      user.balance += amount;
      bank.balance -= amount;

      await user.save();
      await bank.save();

      msg.reply(`**${msg.author.displayName}**, you successfully withdraw **__${amount.toLocaleString()}__** ${currency} CP coins from your bank.`);
    } catch (error) {
      console.error(error);
      msg.reply('An error occurred while executing this command.');
    }
  },
};
