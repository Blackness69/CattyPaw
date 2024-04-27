const { getPrefix, ownerIds } = require('../config');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js');
const Level = require('../Schemas/economy/levelSchema');
const { grantXP, handleLevelUp } = require('../handlers/xpHandler');

// Cooldowns map to store cooldown expiration time for each user
const messageCooldowns = new Map();

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot) return;

  const botMention = msg.content === `<@${client.user.id}>`;
  if (botMention) {
    return msg.reply(`Who pinged me? Oh hey ${msg.author.displayName}! Nice to meet you <3`);
  }

  const currentPrefix = (await getPrefix(msg.guild.id)).toLowerCase();
  const messageContent = msg.content.toLowerCase();

  // Check if the message starts with the current prefix or with the default prefix "cp"
  if (!messageContent.startsWith(currentPrefix) && !messageContent.startsWith("cp")) return;

  let prefixLength = currentPrefix.length;
  if (!messageContent.startsWith(currentPrefix)) {
    prefixLength = 2; // Default prefix length 'cp'
  }

  const args = msg.content.slice(prefixLength).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (command) {
    try {
      await command.execute({ client, Discord, args, prefix: currentPrefix, msg });
    } catch (error) {
      console.error(error);
      return msg.reply('There was an error executing that command!');
    }
  }

  // Check cooldown for XP from messaging
  const cooldownExpiration = messageCooldowns.get(msg.author.id);
  if (!cooldownExpiration || Date.now() > cooldownExpiration) {
    // Grant 4 XP for each message sent
    await grantXP(msg.author.id);

    // Set cooldown expiration time (60 seconds cooldown)
    messageCooldowns.set(msg.author.id, Date.now() + 60000);
  }

  // Fetch or create user data from the Level schema
  let user = await Level.findOne({ userId: msg.author.id });

  if (!user) {
    user = await Level.create({
      userId: msg.author.id,
      xp: 0,
      level: 1,
    });
  }

  await handleLevelUp(msg, user);
});