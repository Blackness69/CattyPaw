const { currency, getPrefix } = require('../../config.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const User = require('../../Schemas/economy/userSchema');
const prefix = await getPrefix(msg.guild.id);

module.exports = {
  usage: `${prefix} start`,
  name: 'start',
  description: `Make your account with a bonus of 1,000 ${currency} CP coins and start earning ${currency} CP coins.`,
  async execute({ msg }) {
    try {
      const existingUser = await User.findOne({ userId: msg.author.id });

      if (existingUser) {
        await msg.reply('You have already created your account.');
        return;
      }

      const termsEmbed = new EmbedBuilder()
        .setColor('#ffffff')
        .setTitle('Terms and services')
        .setDescription(`Users of **CattyPal** bot must adhere to legal compliance, respect Discord guidelines, maintain transaction integrity, respect intellectual property, and report violations. Failure to comply may result in disciplinary action, including permanent account suspension or termination.\n\nFeel free to join our [Support Server](https://youtube.com/@NotBlackness) and ask for any assistance.`)
        .setTimestamp();

      const acceptButton = new ButtonBuilder()
        .setCustomId('accept_terms')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(acceptButton);

      const termsMessage = await msg.reply({
        embeds: [termsEmbed],
        components: [row],
      });

      const filter = i => i.user.id === msg.author.id;
      const collector = termsMessage.createMessageComponentCollector({ filter, time: 120000 });

      collector.on('collect', async i => {
        if (i.user.id !== msg.author.id) {
          await i.reply('This is not your message.');
          return;
        }

        await termsMessage.edit({
          embeds: [termsEmbed],
          components: [],
        });

        const newUser = new User({
          userId: msg.author.id,
          userName: msg.author.username, // Corrected typo from msg.authir.username
          balance: 1000,
        });

        await newUser.save();

        const successMessage = `Your account has been created, here is your starter ${currency} CP coins: **__1,000__**`;

        await i.update({ content: successMessage, embeds: [] });
        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          termsMessage.edit({
            embeds: [termsEmbed],
            components: [],
          });
          termsMessage.followUp(
            "You did not accept the terms within the given time."
          );
        }
      });
    } catch (error) {
      console.error('An error occurred while creating account:', error);
      msg.reply('An error occurred while creating your account.');
    }
  },
};
