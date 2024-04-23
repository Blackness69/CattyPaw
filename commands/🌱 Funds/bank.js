const UserAccount = require('../../Schemas/economy/userSchema');
const Bank = require('../../Schemas/economy/bankSchema');
const { currency } = require('../../config.js');

module.exports = {
  name: 'bank',
  description: 'Manage your bank account',
  async execute({msg}) {
    try {
      const user = await UserAccount.findOne({ userId: msg.author.id });
      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      const bank = await Bank.findOne({ userId: msg.author.id });

      // If bank balance is null or undefined, set it to 0
      const bankBalance = bank ? (bank.balance || 0) : 0;

      msg.reply(`Your bank balance is **__${bankBalance.toLocaleString()}__** ${currency} CP coins.`);
    } catch (error) {
      console.error('Bank error', error);
      msg.reply('An error occurred while checking your bank balance!');
    }
  },
};
