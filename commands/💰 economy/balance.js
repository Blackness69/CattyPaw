const { prefix, currency } = require('../../config.js');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'money', 'cash', 'wallet'],
  description: 'Check your account balance.',
  async execute({msg}) {
    try {
      const existingUser = await User.findOne({ userId: msg.author.id });

      if (existingUser) {
        const formattedBalance = existingUser.balance.toLocaleString();  
        await msg.reply(`Your account balance is **__${formattedBalance}__** ${currency} coins.`);
        
      } else {
        await msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }
    } catch (err) {
      console.error('Error while checking balance', err);
      msg.reply('An error occured while checking your balance.');
    }
  },
};
