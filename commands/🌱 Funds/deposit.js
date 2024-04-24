const UserAccount = require('../../Schemas/economy/userSchema');
const Bank = require('../../Schemas/economy/bankSchema');
const{ currency, getPrefix } = require('../../config.js');
const prefix = await getPrefix(msg.guild.id);

module.exports = {
  usage: `${prefix} deposit <amount>`,
  name: 'deposit',
  aliases: ['dep'],
  description: 'Deposit CP coins to your bank.',
  async execute({msg, args}) {
    try {
      const user = await UserAccount.findOne({ userId: msg.author.id });
      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      const amount = parseInt(args[0]); 
      if (isNaN(amount) || amount <= 0) {
        return msg.reply('Please enter a valid amount to deposit.');
      }

      const userBalance = user.balance;
      if (amount > userBalance) {
        return msg.reply(`You don\'t have enough ${currency} CP coins to deposit.`);
      }

      let bank = await Bank.findOne({ userId: msg.author.id });
      if (!bank) {
        bank = new Bank({
          userId: msg.author.id,
          balance: 0,
        });
      }

      user.balance -= amount;
      bank.balance += amount;

      await user.save();
      await bank.save();

      return msg.reply(`${msg.author.displayName}, you successfully deposit **__${amount.toLocaleString()}__** ${currency} CP coins to your bank.`);
    } catch (error) {
      console.error(error);
      msg.reply('An error occurred while executing this command.');
    }
  },
};
