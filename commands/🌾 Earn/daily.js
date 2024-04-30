const { getPrefix, currency } = require('../../config.js');
const Cooldown = require('../../Schemas/cooldown/CooldownDaily');
const User = require('../../Schemas/economy/userSchema');
const { grantXP } = require('../../handlers/xpHandler');

module.exports = {
  usage: 'cp daily',
  name: 'daily',
  description: 'Claim your daily coins.',
  async execute({msg}) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await User.findOne({ userId: msg.author.id });

      if (!user) {
        return msg.reply(`**${msg.author.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`cp start\`? 🌟`);
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

      const randomReward = Math.floor(Math.random() * 4501) + 1000; // Random reward between 100 and 4500
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
      const xpToAdd = 5;
      await grantXP(msg.author.id, xpToAdd);

      await msg.reply(`You have claimed your daily **__${randomReward.toLocaleString()}__** ${currency} CP coins.`)
    } catch (err) {
      console.error('Daily Reward Error', err);
      msg.reply('An error ocurred while processing your daily.');
    }
  },
};
