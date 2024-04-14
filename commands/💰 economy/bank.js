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

      const bank = await Bank.findOne({ userId: msg.author.id });
      const bankBalance = bank.balance;
      
      msg.reply(`Your bank balance is **${bankBalance.toLocaleString()}__** CP coins.`);
    } catch (error) {
      console.error('Bank error', error);
      msg.reply('An error occured while checking your bank balance!');
    }
  },
};
