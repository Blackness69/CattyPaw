// zoo.js
const Hunt = require('../../Schemas/economy/huntSchema');
const User = require('../../Schemas/economy/userSchema');
const { getPrefix, currency } = require('../../config.js');

module.exports = {
  usage: 'cp zoo',
  name: 'zoo',
  aliases: ['z'],
  description: 'See your hunted animals zoo',
  async execute({ args, client, msg }) {
    try {
      const prefix = await getPrefix(msg.guild.id);
      const user = await User.findOne({ userId: msg.author.id });
      
      if (!user) {
        return msg.reply(`${msg.author.displayName}, Oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`\`${prefix} start\`\`? 🌟`);
      }
      
      const huntedAnimals = (await Hunt.findOne({ userId: msg.author.id }))?.huntedAnimals || [];
      if (huntedAnimals.length === 0) {
        return msg.reply(`You have not caught any animals yet. Go hunting with the \`\`${prefix} hunt\`\` command!`);
      }

      const uniqueAnimals = [...new Set(huntedAnimals)]; // Get unique animals
      let zooMessage = '';
      uniqueAnimals.forEach(animal => {
        const count = huntedAnimals.filter(a => a === animal).length;
        zooMessage += `${animal}: ${count}\n`;
      });
      msg.reply(`Your zoo:\n${zooMessage}`);

    } catch (error) {
      console.error('An error occurred while processing zoo command:', error);
      msg.reply('An error occurred while processing your request.');
    }
  },
};
