// sell.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const { getPrefix, currency } = require('../../config.js');
const animalPrices = {
  '🦓': 20,
  '🐅': 150,
  '🐘': 100,
  '🦒': 40,
  '🐈': 15,
  '🐄': 20,
  '🐀': 10,
  '🐶': 35,
  '🐉': 999,
};

function getAnimalEmoji(name) {
  const customNameToEmoji = {
    zebra: '🦓',
    tiger: '🐅',
    elephant: '🐘',
    giraffe: '🦒',
    cat: '🐈',
    cow: '🐄',
    rat: '🐀',
    dog: '🐶',
    dragon: '🐉',
  };
  return customNameToEmoji[name.toLowerCase()] || name;
}

module.exports = {
  usage: 'cp sell <animal>',
  name: 'sell',
  description: 'Sell animals from your zoo',
  async execute({ args, client, msg }) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await User.findOne({ userId: msg.author.id });
      
      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      let huntedAnimals = (await Hunt.findOne({ userId: msg.author.id }))?.huntedAnimals || [];
      if (huntedAnimals.length === 0) {
        return msg.reply(`You don't have any animals to sell. Go for hunting with the \`\`${prefix} hunt\`\` command!`);
      }

      if (args.includes('all')) {
        let totalPrice = 0;
        for (const animal of huntedAnimals) {
          const price = animalPrices[animal] || 0;
          totalPrice += price;
        }
        await Hunt.findOneAndUpdate({ userId: msg.author.id }, { huntedAnimals: [] });
        await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: totalPrice } });
        return msg.reply(`You sold all of your animals for a total of **__${totalPrice.toLocaleString()}__** ${currency} CP coins.`);
      }

      const [animalOrName, count] = args;
      const animal = getAnimalEmoji(animalOrName);

      const price = animalPrices[animal] || 0;
      if (!price) {
        return msg.reply('Invalid animal. Please specify a valid animal emoji or name.');
      }

      let sellCount = 1;
      if (count && !isNaN(count)) {
        sellCount = parseInt(count);
      }

      const animalCount = huntedAnimals.filter(a => a === animal).length;
      if (sellCount > animalCount) {
        return msg.reply(`You don't have ${sellCount} ${animal}(s) to sell.`);
      }

      const soldAnimals = huntedAnimals.splice(0, sellCount);
      await Hunt.findOneAndUpdate({ userId: msg.author.id }, { huntedAnimals: huntedAnimals });

      const totalPrice = sellCount * price;
      await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: totalPrice } });

      if (sellCount === 1) {
        return msg.reply(`You sold 1 ${animal} for **__${price.toLocaleString()}__** ${currency} CP coins.`);
      } else {
        return msg.reply(`You sold ${sellCount} ${animal}(s) for a total of **__${totalPrice.toLocaleString()}__** ${currency} CP coins.`);
      }

    } catch (error) {
      console.error('An error occurred while processing sell command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};
