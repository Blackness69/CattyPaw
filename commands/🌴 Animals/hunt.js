// hunt.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const Cooldown = require('../../Schemas/cooldown/CooldownHunt');
const { getPrefix, currency } = require('../../config.js');
const { grantXP } = require('../../handlers/xpHandler');

// Define animals with their probabilities (rarity)
const animals = [
  { emojis: ['🐝', '🐛', '🐌', '🐞', '🦋'], probability: 0.9 },  // 90% chance
  { emojis: ['🐤', '🐁', '🐔', '🐇', '🐿️'], probability: 0.8 }, // 80% chance
  { emojis: ['🐑', '🐖', '🐄', '🐕', '🐈'], probability: 0.6 }, // 60% chance
  { emojis: ['🐊', '🐅', '🐧', '🐘', '🐳'], probability: 0.4 },  // 40% chance
  { emojis: ['🐉', '🦄', '☃️', '👻', '🕊️'], probability: 0.2 },  // 20% chance
  { emojis: ['🦁', '🦣', '🦖', '🦅', '🦍'], probability: 0.05 }, // 5% chance
];

module.exports = {
  usage: 'cp hunt',
  name: 'hunt',
  aliases: ['h'],
  description: `Embark on a hunting expedition to capture animals.`,
  async execute({ args, msg, client }) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await User.findOne({ userId: msg.author.id });

      if (!user) {
        return msg.reply(`**${msg.author.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`cp start\`? 🌟`);
      }

      const cooldown = await Cooldown.findOne({ userId: msg.author.id });

      if (!user || user.balance < 20) {
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

      // Select a random number of animals between 1 and 11
      const numberOfAnimals = Math.floor(Math.random() * 11) + 1;
      
      // Select random animals based on their probabilities
      const huntedAnimals = [];
      for (let i = 0; i < numberOfAnimals; i++) {
        const randomAnimal = getRandomAnimal();
        huntedAnimals.push(randomAnimal);
      }

      // Grant XP to the user
      const xpToAdd = 5;
      await grantXP(msg.author.id, xpToAdd);

      msg.reply(`You spent **__20__** ${currency} CP coins and go for hunting. And you caught the following animals:\n${huntedAnimals.join(' ')}`);

      // Save the hunted animals to the database
      await Hunt.findOneAndUpdate({ userId: msg.author.id }, { $push: { huntedAnimals } }, { upsert: true });

      // Deduct coins from the user's wallet
      await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: -20 } });

      const timeout = 30000; // 40 seconds
      await Cooldown.findOneAndUpdate({ userId: msg.author.id }, { cooldownExpiration: Date.now() + timeout }, { upsert: true });

    } catch (error) {
      console.error('An error occurred while processing the hunt command:', error);
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
      const emojis = animal.emojis;
      const randomIndex = Math.floor(Math.random() * emojis.length);
      return emojis[randomIndex];
    }
  }
}