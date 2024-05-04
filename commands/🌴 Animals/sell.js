// sell.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const { getPrefix, currency } = require('../../config.js');

const animalPrices = {
  '🐝': 10,
  '🐛': 10,
  '🐌': 10,
  '🐞': 10,
  '🦋': 10,
  '🐤': 25,
  '🐁': 25,
  '🐔': 25,
  '🐇': 25,
  '🐿️': 25,
  '🐑': 35,
  '🐖': 35,
  '🐄': 35,
  '🐕': 35,
  '🐈': 35,
  '🐊': 45,
  '🐅': 45,
  '🐧': 45,
  '🐘': 45,
  '🐳': 45,
  '🐉': 60,
  '🦄': 60,
  '☃️': 60,
  '👻': 60,
  '🕊️': 60,
  '🦁': 1200,
  '🦣': 1200,
  '🦖': 1200,
  '🦅': 1200,
  '🦍': 1200,
};

function getAnimalEmoji(name) {
  const customNameToEmoji = {
    bee: '🐝',
    worm: '🐛',
    snail: '🐌',
    ladybug: '🐞',
    butterfly: '🦋',
    chick: '🐤',
    mouse: '🐁',
    rat: '🐁',
    mouse2: '🐁',
    chicken: '🐔',
    rabbit: '🐇',
    squirrel: '🐿️',
    sheep: '🐑',
    pig: '🐖',
    cow: '🐄',
    dog: '🐕',
    cat: '🐈',
    crocodile: '🐊',
    tiger: '🐅',
    penguin: '🐧',
    elephant: '🐘',
    whale: '🐳',
    dragon: '🐉',
    unicorn: '🦄',
    snowman: '☃️',
    ghost: '👻',
    dove: '🕊️',
    lion: '🦁',
    mammoth: '🦣',
    dinosaur: '🦖',
    eagle: '🦅',
    gorilla: '🦍',
  };

  return customNameToEmoji[name] || name; // Return the mapped emoji or the original name if not found
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
        return msg.reply(`**${msg.author.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`${prefix}start\`? 🌟`);
      }

      let huntedAnimals = (await Hunt.findOne({ userId: msg.author.id }))?.huntedAnimals || [];
      if (huntedAnimals.length === 0) {
        return msg.reply(`You don't have any animals to sell. Go for hunting with the \`${prefix}hunt\` command!`);
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

      for (let i = 0; i < sellCount; i++) {
        const animalIndex = huntedAnimals.indexOf(animal);
        huntedAnimals.splice(animalIndex, 1);
      }

      const totalPrice = sellCount * price;
      await User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { balance: totalPrice } });
            await Hunt.findOneAndUpdate({ userId: msg.author.id }, { huntedAnimals: huntedAnimals });

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