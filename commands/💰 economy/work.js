// work.js
const CooldownWork = require('../../Schemas/cooldown/CooldownWork');
const User = require('../../Schemas/economy/userSchema');
const { prefix, currency } = require('../../config.js');

module.exports = {
  name: 'work',
  description: 'Work and earn some CP coins',
  async execute({ args, msg, client }) {
    try {
      const user = await User.findOne({ userId: msg.author.id });
      const cooldown = await CooldownWork.findOne({ userId: msg.author.id });

      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      if (cooldown && cooldown.cooldownExpiration > Date.now()) {
        const timeLeft = Math.floor((cooldown.cooldownExpiration - Date.now()) / 1000); // Convert to seconds

        // Send cooldown message with remaining time using Discord time formatting
        return msg.reply(`⏳ | **${msg.author.displayName}**, Hang tight! You can use this command again **<t:${Math.floor(Date.now() / 1000) + timeLeft}:R>**.`).then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000)
        });
      }

      const randomOutcome = Math.random() < 0.5 ? 'win' : 'lose';
      let message;

      if (randomOutcome === 'win') {
        const randomCoins = Math.floor(Math.random() * (801 - 200)) + 200; // Random number between 200 and 800
        message = `You worked and got **__${randomCoins.toLocaleString()}__** ${currency} coins.`;
        await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: randomCoins } });
      } else {
        message = 'You worked and got nothing. Better luck next time!';
      }

      const timeout = 60000; // 1 minute cooldown in milliseconds
      await CooldownWork.findOneAndUpdate({ userId: msg.author.id }, { cooldownExpiration: Date.now() + timeout }, { upsert: true, new: true });

      return msg.reply(message);
    } catch (error) {
      console.error('An error occurred while processing work command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};
