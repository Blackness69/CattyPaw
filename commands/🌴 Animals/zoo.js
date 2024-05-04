// zoo.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const { getPrefix, currency } = require('../../config.js');
const { EmbedBuilder } = require('discord.js');

// Define animals with their ranks
const ranks = {
  '<:common:1235939253272186946>': ['🐝', '🐛', '🐌', '🐞', '🦋'],
  '<:uncommon:1235939386089017395>': ['🐤', '🐁', '🐔', '🐇', '🐿️'],
  '<:rare:1235939428019605614>': ['🐑', '🐖', '🐄', '🐕', '🐈'],
  '<:epic:1235939504204943391>': ['🐊', '🐅', '🐧', '🐘', '🐳'],
  '<:mythic:1235939546458361936>': ['🐉', '🦄', '☃️', '👻', '🕊️'],
  '<:legendary:1235939573574406174>': ['🦁', '🦣', '🦖', '🦅', '🦍']
};

// Unicode superscript characters for small numbers
const smallNumbers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

module.exports = {
  usage: 'cp zoo',
  name: 'zoo',
  aliases: ['z'],
  description: 'See your hunted animals zoo',
  async execute({ args, client, msg }) {
    try {
      const user = await User.findOne({ userId: msg.author.id });

      if (!user) {
        return msg.reply(`**${msg.author.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`${prefix}start\`? 🌟`);
      }

      const huntedAnimals = (await Hunt.findOne({ userId: msg.author.id }))?.huntedAnimals || [];

      const zooEmbed = new EmbedBuilder()
        .setTitle(`🌱 **${msg.author.displayName}**'s Zoo 🌱`)
        .setColor('#ffffff');

      let zooDescription = '';
      for (const [rank, animals] of Object.entries(ranks)) {
        let animalString = '';
        animals.forEach(animal => {
          const count = huntedAnimals.filter(a => a === animal).length;
          animalString += count > 0 ? `${animal}${count <= 9 ? smallNumbers[count] : count.toString().split('').map(digit => smallNumbers[parseInt(digit)]).join('')} ` : '❔ ';
        });
        zooDescription += `${rank} | ${animalString}\n`;
      }

      zooEmbed.setDescription(zooDescription);
      msg.reply({ embeds: [zooEmbed] });

    } catch (error) {
      console.error('An error occurred while processing zoo command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};