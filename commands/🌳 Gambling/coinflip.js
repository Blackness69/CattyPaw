const { getPrefix, currency, coinflip, coinflip2 } = require('../../config.js');
const Cooldown = require('../../Schemas/cooldown/CooldownCoinflip');
const User = require('../../Schemas/economy/userSchema');
const ms = require('pretty-ms');
const { grantXP } = require('../../handlers/xpHandler');
const prefix = await getPrefix(msg.guild.id);

module.exports = {
  usage: `${prefix} coinflip <amount> <heads/tails>`,
  name: 'coinflip',
  aliases: ['cf'],
  description: 'Make a coinflip bet',
  async execute({ args, msg }) {
    try {
      const existingUser = await User.findOne({ userId: msg.author.id });

      if (!existingUser) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }

      const cooldown = await Cooldown.findOne({ userId: msg.author.id });

      if (cooldown && cooldown.cooldownExpiration > Date.now()) {
        const timeLeft = Math.floor((cooldown.cooldownExpiration - Date.now()) / 1000); // Convert to seconds

        // Send cooldown message with remaining time using Discord time formatting
        return msg.reply(`⏳ | **${msg.author.displayName}**, Hang tight! You can use this command again **<t:${Math.floor(Date.now() / 1000) + timeLeft}:R>**.`).then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000)
        });
      }

      const timeout = 20000; // 20 seconds in milliseconds

      if (!args[0]) {
        return msg.reply(`Wrong argument! Usage: \`\`${prefix} coinflip <amount> [heads/tails]\`\``);
      }

      const user = msg.author;
      let amount = args[0].toLowerCase() === 'all' ? (await User.findOne({ userId: user.id })).balance : parseInt(args[0]);
      const bet = args[1] && args[1].toLowerCase();

      amount = Math.min(amount, 250000);

      if (isNaN(amount) || amount <= 0) {
        return msg.reply('Amount must be a positive number');
      }

      let betLabel;
      let userBet;

      if (bet === 'h' || bet === 'heads') {
        userBet = 'heads';
        betLabel = 'heads';
      } else if (bet === 't' || bet === 'tails') {
        userBet = 'tails';
        betLabel = 'tails';
      } else {
        // If the user didn't choose heads or tails, default to 'heads'
        userBet = 'heads';
        betLabel = 'heads'; // Adjusted to show 'heads' explicitly
      }

      const currentBalance = existingUser.balance;

      if (currentBalance < amount) {
        return msg.reply(`You don't have enough ${currency} CP coins to make that bet`);
      }

      const xpToAdd = 17;
      await grantXP(msg.author.id, xpToAdd);

      // Send the initial message indicating the user's choice and the amount bet
      let initialMessage = await msg.reply(`**${user.displayName}**, You bet **__${amount.toLocaleString()}__** ${currency} CP coins and choose **${betLabel}**\nAnd the coin flips ${coinflip}`);

      const result = Math.random() < 0.5 ? 'heads' : 'tails'; // Generate random result for the coinflip

      let outcome;
      let winnings = 0;

      // Determine the outcome based on the user's bet
      if (result === userBet) {
        outcome = 'won';
        winnings = amount * 2; // User wins double the bet amount
      } else {
        outcome = 'lost';
      }

      // Update user balance
      if (outcome === 'won') {
        existingUser.balance += winnings - amount; // Add winnings and subtract the initial bet
      } else {
        existingUser.balance -= amount; // Deduct the bet amount if lost
      }

      await existingUser.save();

      // Edit the initial message to display the outcome and winnings after 4 seconds
      setTimeout(() => {
        if (outcome === 'won') {
          initialMessage.edit(`**${user.displayName}**, You bet **__${amount.toLocaleString()}__** ${currency} CP coins and choose **${betLabel}**\nAnd the coin flips ${coinflip2} and you won **__${winnings.toLocaleString()}__** ${currency} CP coins.`);
        } else {
          initialMessage.edit(`**${user.displayName}**, You bet **__${amount.toLocaleString()}__** ${currency} CP coins and choose **${betLabel}**\nAnd the coin flips ${coinflip2} and you ${outcome} **__${amount.toLocaleString()}__** ${currency} CP coins.`);
        }
      }, 4000);

      // Set cooldown
      await Cooldown.findOneAndUpdate({ userId: user.id }, { cooldownExpiration: Date.now() + timeout }, { upsert: true, new: true });
    } catch (error) {
      console.error('An error occurred while processing coinflip command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};