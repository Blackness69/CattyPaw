const { prefix } = require('../config');
const ms = require('pretty-ms');
const {db} = require('../db.js');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js')

client.on("messageCreate", async (msg) => {
  if(!msg.content) return;
  const botMention = msg.content === `<@${client.user.id}>`;
  if (botMention) {
     msg.reply(`Who pinged me? Oh hey ${msg.author.displayName}! Nice to meet you <3`);
  }
  if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return;

  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  try {
    await command.execute({client, Discord, ms, args, db, prefix, msg});
  } catch (error) {
    console.error(error);
    msg.reply('There was an error executing that command!');
  }
});