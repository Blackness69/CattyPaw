const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const User = require('../../Schemas/economy/userSchema');

module.exports = {
  name: 'give',
  description: 'Give CP coins to another user',
  async execute({ msg, args }) {
    if (!args[0] || !args[1]) {
      return msg.reply('Please provide the user mention and the amount to give.');
    }

    const member = msg.mentions.members.first();
    if (!member) {
      return msg.reply('User not found.');
    }

    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) {
      return msg.reply('Invalid amount. Please provide a positive number.');
    }

    const user = await User.findOne({ userId: msg.author.id });
    if (!user || user.balance < amount) {
      return msg.reply(`You don't have enough ${currency} CP coins to give.`);
    }

    const targetUser = await User.findOne({ userId: member.id });
    if (!targetUser) {
      return msg.reply('Target user not found.');
    }

    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm_give')
          .setLabel('Confirm')
          .setStyly(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('cancel_give')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌'),
      );

    const confirmEmbed = new EmbedBuilder()
    .setTitle('Give Confirmation')
    .setDescription(`${msg.author}, are you sure you want to give **__${amount.toLocaleString()}__** ${currency} CP coins to ${member}? You can't undo it later.`)
    
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
        });
      } else if (i.customId === 'cancel_give') {
        await confirmMsg.edit({
          content: 'Give command cancelled.',
          components: [],
        });
      }
      collector.stop();
    });

    collector.on('end', () => {
      if (confirmMsg.components.length > 0) {
        confirmMsg.edit({
          content: 'Give command timed out. Please try again.',
          components: [],
        });
      }
    });
  },
};
