// hunt.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const Cooldown = require('../../Schemas/cooldown/CooldownHunt');
const { prefix, currency } = require('../../config.js');

module.exports = {
  name: 'hunt',
  description: 'Hunt for animals and earn FX coins by selling them',
  async execute({ args, msg, client }) {
    try {
      const user = await User.findOne({ userId: msg.author.id });
      const cooldown = await Cooldown.findOne({ userId: msg.author.id });

      if (!user || user.wallet < 10) {
        return msg.reply(`You don't have enough CP coins to go for a hunt.`);
      }

      if (cooldown && cooldown.cooldownExpiration > Date.now()) {
        const timeLeft = Math.floor((cooldown.cooldownExpiration - Date.now()) / 1000);
        return msg.reply(`**${msg.author.displayName}**, hey slowdown! You can use this command again <t:${Math.floor(Date.now() / 1000) + timeLeft}:R>.`);
      }

      const animals = ['🦓', '🐅', '🐘', '🦒', '🐈', '🐄', '🐀', '🐶', '🐉'];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

      msg.reply(`You spent 10 ${currency} coins and go to hunting. And you caught\n${randomAnimal}`);

      await Hunt.findOneAndUpdate({ userId: msg.author.id }, { $push: { huntedAnimals: randomAnimal } }, { upsert: true });
      await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: -10 } });

      const timeout = 30000; // 30 seconds
      await Cooldown.findOneAndUpdate({ userId: msg.author.id }, { cooldownExpiration: Date.now() + timeout }, { upsert: true });

    } catch (error) {
      console.error('An error occurred while processing hunt command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};
