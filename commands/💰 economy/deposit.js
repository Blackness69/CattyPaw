const { EmbedBuilder } = require('discord.js');
const UserAccount = require('../../Schemas/economy/userSchema');
const Bank = require('../../Schemas/economy/bankSchema');

module.exports = {
  name: 'bank',
  description: 'Manage your bank account',
  async execute({msg}) {
    try{
      const user = await UserAccount.findOne({ userId: msg.author.id });
      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }
      
      const amount = parseInt(args[0]); 
      if (amount <= 0) {
        return msg.reply('Please enter a valid amount to deposit.');
      }

      const userBalance = user.balance;
      if (amount > userBalance) {
        return msg.reply('You don\'t have enough CP coins to deposit.');
      }
      let bank = await Bank.findOne({ userId: msg.author.id });

      if (!bank) {
        bank = new Bank({
          userId: msg.author.id,
          balance: 0,
        })
      }

      user.balaance -= amount;
      bank.balance += amount;

      await user.save();
      await bank.save();

      return msg.reply(`Successfully deposited **__${amount.toLocaleString()}__** CP coins to your bank.`);
    } catch (error) {
      console.error(error);
      msg.reply('An error occured while executing this command.');
    }
  },
};