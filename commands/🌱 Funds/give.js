const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const User = require('../../Schemas/economy/userSchema');
const { getPrefix, currency } = require('../../config.js');

module.exports = {
  usage: 'cp give <user> <amount>',
  name: 'give',
  description: 'Give CP coins to another user',
  async execute({ msg, args }) {
    const user = await User.findOne({ userId: msg.author.id });
    const prefix = await getPrefix(msg.guild.id);
    if (!user) {
      return msg.reply(`**${msg.author.displayName}**, oopsie! It seems like you haven't started your adventure yet! How about beginning your journey by typing \`${prefix}start\`? 🌟`);
    }
    if (!args[0] || !args[1]) {
      return msg.reply('Please provide the user mentioned and the amount to give.');
    }

    const member = msg.mentions.members.first();
    
    if (!member) {
      return msg.reply('User not found.');
    }
    if (member && member.id === msg.author.id) {
      return msg.reply("You can't give coins to yourself.");
    }
    if (member && member.user.bot) {
      return msg.reply("You can't give coins to bots.");
    }
    
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount < 0 || amount > 1000000) {
      return msg.reply('Invalid amount. Please provide a positive number.');
    }

    if (!user || user.balance < amount) {
      return msg.reply(`You don't have enough ${currency} CP coins to give.`);
    }

    const targetUser = await User.findOne({ userId: member.user.id });
    if (!targetUser) {
      return msg.reply('Target user doesn\'t have an account yet.');
    }

    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm_give')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('cancel_give')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌'),
      );

    const confirmEmbed = new EmbedBuilder()
      .setTitle('Give Confirmation')
      .setColor('#ffffff')
      .setDescription(`${msg.author}, are you sure you want to give **__${amount.toLocaleString()}__** ${currency} CP coins to ${member}? You can't undo it later.`);

    const confirmMsg = await msg.reply({
      embeds: [confirmEmbed],
      components: [confirmRow],
    });

    const filter = i => i.user.id === msg.author.id;
    const collector = confirmMsg.createMessageComponentCollector({ filter, time: 35000 });

    collector.on('collect', async i => {
      if (i.customId === 'confirm_give') {
        user.balance -= amount;
        targetUser.balance += amount;
        await user.save();
        await targetUser.save();
        await confirmMsg.edit({
          content: `${member}, ${msg.author} gave you **__${amount.toLocaleString()}__** ${currency} CP coins!`,
          components: [],
          embeds: [],
        });
      } else if (i.customId === 'cancel_give') {
        await confirmMsg.edit({
          content: 'Give command cancelled.',
          components: [],
          embeds: [],
        });
      }
      collector.stop();
    });

    collector.on('end', () => {
      if (confirmMsg.components.length > 0) {
        confirmMsg.edit({
          content: 'Give command timed out. Please try again.',
          components: [],
          embeds: [],
        });
      }
    });
  },
};