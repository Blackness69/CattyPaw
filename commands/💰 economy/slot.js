const { EmbedBuilder } = require('discord.js');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'slot',
  description: 'Play a slot machine game.',
  async execute({ msg, args }) {
    const fruits = ['🍎', '🍇', '🍒', '🍓'];
    let betAmount = parseInt(args[0]) || 0;
    const maxBet = 250000; // Max bet amount

    if (betAmount <= 0 || isNaN(betAmount)) {
      return msg.reply('Please enter a valid bet amount.');
    }

    // Adjust bet amount to the maximum allowed if it exceeds the maximum
    if (betAmount > maxBet) {
      betAmount = maxBet;
    }

    const user = await User.findOne({ userId: msg.author.id });

    if (!user) {
      return msg.reply(`Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
    }

    if (user.balance < betAmount) {
      return msg.reply('You don\'t have enough CP coins to place this bet.');
    }

    const outcomeMessage = await msg.reply(`[🎰] [🎰] [🎰]`);

    const outcome = [];

    // Randomizing the outcome after 5 seconds
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * fruits.length);
        outcome.push(fruits[randomIndex]);
      }

      const result = outcome.join(' ');
      const embed = new EmbedBuilder()
        .setTitle('Slot Machine')
        .setDescription(result)
        .addField('Outcome', result)
        .setColor('#FFFF00')
        .setTimestamp();

      outcomeMessage.edit({ embeds: [embed] });

      const winnings = calculateWinnings(outcome, betAmount);

      if (winnings > 0) {
        user.balance += winnings;
        user.save();
        msg.reply(`Congratulations! You won ${winnings.toLocaleString()} CP coins.`);
      } else {
        msg.reply('Better luck next time!');
      }
    }, 5000);

    // Updating the slot machine every second
    let index = 0;
    setInterval(() => {
      index = (index + 1) % fruits.length;
      const newSlot = `[${fruits[index]}] [${fruits[(index + 1) % fruits.length]}] [${fruits[(index + 2) % fruits.length]}]`;
      outcomeMessage.edit(newSlot);
    }, 1000);
  },
};

function calculateWinnings(outcome, betAmount) {
  const strawberryProbability = 0.05;
  const strawberryMultiplier = 4;
  const otherFruitsMultiplier = 2;

  if (outcome.includes('🍓') && Math.random() < strawberryProbability) {
    return betAmount * strawberryMultiplier;
  } else if (outcome.every(fruit => fruit === '🍓')) {
    return betAmount * strawberryMultiplier;
  } else if (outcome.every(fruit => fruits.includes(fruit))) {
    return betAmount * otherFruitsMultiplier;
  } else {
    return 0;
  }
}
