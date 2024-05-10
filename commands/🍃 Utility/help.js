// commands/help.js
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');
const {getPrefix} = require('../../config');
const {db} = require('../../db.js');

module.exports = {
  usage: 'cp help',
  name: 'help',
  description: 'Shows list of available commands',
  async execute({msg, args, client}) {
    const customEmojis = {
      // all custom emojis to help embed

    }
    const prefix = await getPrefix(msg.guild.id);
    const commands = client.commands.map(command => command)
    const commandNames = []
    const categories = []
    for (const command of commands) {
      commandNames.push(`\`${command.name}\``)

      if (command.category.includes('🍀 Developer-only')) continue;
      const name = command.category.split(' ')[1]
      const guildEmoji = client.emojis.cache.get(customEmojis[name])
      const emoji = (guildEmoji ? {name: guildEmoji.name, id: guildEmoji.id, animated: guildEmoji.animated} : false) || {name: command.category.split(' ')[0]} || {name: '❔'}
      if(categories.find(category => category.name === name)) continue;
        categories.push({name, emoji})  
    }
    const embeds = []
    for (const category of categories) {
      const commandsInCategory = commands.filter(command => command.category.split(' ')[1] === category.name)
      const commandList = commandsInCategory.map(command => ({name: `${command.name} | \`\`${command.usage}\`\``, value: command.description || 'No description', inline: true}))
      const categoryEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(`${category.emoji.id ? `<${category.emoji.animated ? 'a' : ''}:${category.emoji.name}:${category.emoji.id}>` : category.emoji.name} ${category.name} Commands`)
        .setDescription(`[Support Server](https://discord.com/invite/yyudU8K6fe)\nMy prefix for this server - \`\`${prefix}\`\`\n\nAvailable ${category.name} commands list`)
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
      .setDescription(`[Support Server](https://discord.com/invite/yyudU8K6fe)\nMy prefix for this server - \`\`${prefix}\`\`\n\n${categories.map(({name, emoji}) => `${emoji.id ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : emoji.name} **${name}**`).join('\n')}`)
      .setTimestamp();
    const response = await msg.channel.send({ embeds: [helpEmbed], components: [row] });
    try {
const collector = response.createMessageComponentCollector({time: 480000 });
      collector.on('collect', async i => {
        if(i.customId !== 'helpCommand') return;
        if(i.user.id !== msg.author.id) return i.reply({ content: `That's not your help menu! Create one with \`\`cp help\`\``, ephemeral: true });   
        const value = i.values[0]
        if (value !== 'homepage') {
          await i.update({ embeds: [embeds[value]], components: [row] });
        } else if (value === 'homepage') {
          await i.update({ embeds: [helpEmbed], components: [row] });
        }
      })
      collector.on('end', () => {
        await i.update({ content: 'help command timed out', components: [] });
      })
    } catch (error) {
      console.error(error);
    }
  },
};
