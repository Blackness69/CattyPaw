const { prefix, currency } = require('../../config.js');
const Cooldown = require('../../Schemas/cooldown/CooldownDaily');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'daily',
  description: 'Claim your daily coins.',
  async execute({msg}) {
    try {
      const user = await User.findOne({ userId: msg.author.id });

      if (!user) {
        return await msg.reply(`:ribbon: You didn't have a account yet, create one with \`\`${prefix} start\`\` command.`);
      }

      let cooldown = await Cooldown.findOne({ userId: msg.author.id });
      if (cooldown && cooldown.cooldownExpiration > Date.now()) {
        const remainingTime = cooldown.cooldownExpiration - Date.now();
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const timeLeftFormatted = `**${hours}** hours, **${minutes}** minutes, **${seconds}** seconds.`;
        return await msg.reply(`You have already claimed your daily, come back after ${timeLeftFormatted}`);
      }

      const randomReward = Math.floor(Math.random() * 3501) + 500; // Random reward between 500 and 4000
      user.balance += randomReward;
      await user.save();

      const newCooldown = {
        userId: msg.author.id,
        cooldownExpiration: Date.now() + 24 * 60 * 60 * 1000,
      };

      cooldown = await Cooldown.findOneAndUpdate(
        { userId: msg.author.id },
        newCooldown,
        { upsert: true, new: true }
      );

      await msg.reply(`You have claimed your daily **__${randomReward}__** ${currency} coins.`)
    } catch (err) {
      console.error('Daily Reward Error', err);
      msg.reply('An error ocurred while processing your daily.');
    }
  },
};
