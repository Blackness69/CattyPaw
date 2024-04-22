// commands/help.js
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');
const {prefix} = require('../../config');
const {db} = require('../../db.js');

module.exports = {
  owner: true,
  name: 'help',
  description: 'Shows list of available commands',
  async execute({msg, args, client}) {
    const customEmojis = {
      // all custom emojis to help embed

    }
    const commands = client.commands.map(command => command)
    const commandNames = []
    const categories = []
    for (const command of commands) {
      commandNames.push(`\`${command.name}\``)
      const name = command.category.split(' ')[1]
      const guildEmoji = client.emojis.cache.get(customEmojis[name])
      const emoji = (guildEmoji ? {name: guildEmoji.name, id: guildEmoji.id, animated: guildEmoji.animated} : false) || {name: command.category.split(' ')[0]} || {name: '❔'}
      if(categories.find(category => category.name === name)) continue;
        categories.push({name, emoji})  
    }
    const embeds = []
    for (const category of categories) {
      const commandsInCategory = commands.filter(command => command.category.split(' ')[1] === category.name)
      const commandList = commandsInCategory.map(command => ({name: command.name, value: command.description || 'No description.', inline: true}))
      const categoryEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(`${category.emoji.id ? `<${category.emoji.animated ? 'a' : ''}:${category.emoji.name}:${category.emoji.id}>` : category.emoji.name} ${category.name} Commands`)
        .setDescription(`Available ${category.name} commands list`)
        .setAuthor({
          name: msg.guild.name,
          iconURL: msg.guild.iconURL({ dynamic: true })
        })
        .setFooter({text: `Requested by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true })})
        .addFields(commandList)
        .setTimestamp();
      embeds.push(categoryEmbed)
    }
    const homepageEmoji = client.emojis.cache.get(customEmojis['homepage'])
    const options = [{label: 'homepage', description: 'back to homepage', emoji: (homepageEmoji ? {name: homepageEmoji.name, id: homepageEmoji.id, animated: homepageEmoji.animated} : false) || {name: '🏠'}, value: 'homepage'}, ...categories.map(({name, emoji}, index) => {
      const data = {
        label: name,
        description: `bot's ${name} commands`,
        emoji,
        value: `${index}`
      }
      return data
    })]
    const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
      .setCustomId('helpCommand')
      .setPlaceholder('Select a category')
      .addOptions(options)
    )
    const helpEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('List of available commands category')
      .setAuthor({
        name: msg.guild.name,
        iconURL: msg.guild.iconURL({ dynamic: true })
      })
      .setFooter({text: `Requested by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true })})
      .setDescription(categories.map(({name, emoji}) => `${emoji.id ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : emoji.name} **${name}**`).join('\n'))
      .setTimestamp();
    const response = await msg.channel.send({ embeds: [helpEmbed], components: [row] });
    try {
const collector = response.createMessageComponentCollector({time: 150000 });
      collector.on('collect', async i => {
        if(i.customId !== 'helpCommand') return;
        if(i.user.id !== msg.author.id) return i.reply({ content: `That's not your help menu! Create one with ${prefix} help`, ephemeral: true });   
        const value = i.values[0]
        if (value !== 'homepage') {
          await i.update({ embeds: [embeds[value]], components: [row] });
        } else if (value === 'homepage') {
          await i.update({ embeds: [helpEmbed], components: [row] });
        }
      })
    } catch (error) {
      console.error(error);
    }
  },
};
