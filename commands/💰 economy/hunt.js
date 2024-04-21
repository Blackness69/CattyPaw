// hunt.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const Cooldown = require('../../Schemas/cooldown/CooldownHunt');
const { getPrefix, currency } = require('../../config.js');

// Define animals with their probabilities (rarity)
const animals = [
  { emoji: '🦓', probability: 0.1 },  // 10% chance
  { emoji: '🐅', probability: 0.05 }, // 5% chance
  { emoji: '🐘', probability: 0.05 }, // 5% chance
  { emoji: '🦒', probability: 0.1 },  // 10% chance
  { emoji: '🐈', probability: 0.2 },  // 20% chance
  { emoji: '🐄', probability: 0.2 }, // 20% chance
  { emoji: '🐀', probability: 0.3 },  // 30% chance
  { emoji: '🐶', probability: 0.2 },  // 20% chance
  { emoji: '🐉', probability: 0.01 }, // 1% chance
];

module.exports = {
  name: 'hunt',
  aliases: ['h'],
  description: 'Hunt for animals and earn FX coins by selling them',
  async execute({ args, msg, client }) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await User.findOne({ userId: msg.author.id });

      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      const cooldown = await Cooldown.findOne({ userId: msg.author.id });

      if (!user || user.balance < 10) {
        return msg.reply(`You don't have enough ${currency} CP coins to go for a hunt.`);
      }

      if (cooldown && cooldown.cooldownExpiration > Date.now()) {
        const timeLeft = Math.floor((cooldown.cooldownExpiration - Date.now()) / 1000);
        return msg.reply(`⏳ | **${msg.author.displayName}**, Hang tight! You can use this command again **<t:${Math.floor(Date.now() / 1000) + timeLeft}:R>**.`).then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000)
        });
      }

      // Select a random animal based on their probabilities
      const randomAnimal = getRandomAnimal();

      msg.reply(`You spent 10 ${currency} CP coins and go for hunting. And you caught\n${randomAnimal}`);

      // Save the hunted animal to the database
      await Hunt.findOneAndUpdate({ userId: msg.author.id }, { $push: { huntedAnimals: randomAnimal } }, { upsert: true });

      // Deduct coins from the user's wallet
      await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: -10 } });

      const timeout = 30000; // 30 seconds
      await Cooldown.findOneAndUpdate({ userId: msg.author.id }, { cooldownExpiration: Date.now() + timeout }, { upsert: true });

    } catch (error) {
      console.error('An error occurred while processing hunt command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};

// Function to randomly select an animal based on their probabilities
function getRandomAnimal() {
  const randomNumber = Math.random();
  let cumulativeProbability = 0;
  for (const animal of animals) {
    cumulativeProbability += animal.probability;
    if (randomNumber <= cumulativeProbability) {
      return animal.emoji;
    }
  }
}
