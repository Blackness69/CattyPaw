const { prefix, token, avatarURL, mongoURL } = require('./config.js');
const db = require('./db');
const fs = require('fs');
const ms = require('pretty-ms');
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Online Yo Boy !');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { ActivityType, Collection, GatewayIntentBits, Client, Collector, VoiceChannel, EmbedBuilder } = require('discord.js');

const Discord = require('discord.js');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map(intent => intent),
  allowedMentions: { repliedUser: false }
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
        const commandFolders = fs.readdirSync('./commands');
        for (const folder of commandFolders) {
          const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.name, command);
    if(!command.aliases) continue;
    for (const aliase of command.aliases) {
      client.aliases.set(aliase, command.name)
    }
            
  }
};

const slashCommandFolders = fs.readdirSync('./slashCommands');
for (const folder of slashCommandFolders) {
  const slashCommandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${folder}/${file}`);
    slashCommand.category = folder;
    if (slashCommand.data) {
      client.slashCommands.set(slashCommand.data.name, slashCommand);
    }
  }
}

module.exports = client;
// Load event handler files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  require(`./events/${file}`);
};

// Load table files
const tableFiles = fs.readdirSync('./tables').filter(file => file.endsWith('.js'));

for (const file of tableFiles) {
 client.on("ready", require(`./tables/${file}`));
}

client.login(token);