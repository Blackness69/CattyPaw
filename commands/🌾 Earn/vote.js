const { EmbedBuilder, DMChannel } = require('discord.js');
const { currency, topggBotApiKey, clientId } = require('../../config');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  usage: 'cp vote',
  name: 'vote',
  description: `Vote for our bot.`,
  async execute({ msg }) {
    const apiKey = topggBotApiKey;
    const botId = clientId;
    const userId = msg.author.id;
    
    try {
      const response = await fetch(`https://top.gg/api/bots/${botId}/check?userId=${userId}`, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.voted === 1) { // 1 means user already voted
          return msg.reply("You have already voted.");
        } else if (data.voted === 0) {
          const voteEmbed = new EmbedBuilder()
            .setDescription(`Help us by voting our bot on [top.gg](https://top.gg/bot/1229438321395109929/vote) ❤️`);

          // Send the vote embed message
          await msg.reply({ embeds: [voteEmbed] });

        }
      } else {
        return msg.reply('There was an error!');
      }
    } catch (error) {
      console.error('Error while voting', error);
      msg.reply('An error occurred while processing your vote.');
    }
  }
};