// messageCreate.js

const { getPrefix, currency } = require('../config');
const User = require('../Schemas/economy/userSchema');
const Level = require('../Schemas/economy/levelSchema');
const canvafy = require('canvafy');
const ms = require('pretty-ms');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js')

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot) return;

  const botMention = msg.content === `<@${client.user.id}>`;
  if (botMention) {
    return msg.reply(`Who pinged me? Oh hey ${msg.author.displayName}! Nice to meet you <3`);
  }

  const currentPrefix = (await getPrefix(msg.guild.id)).toLowerCase();
  if (!msg.content.toLowerCase().startsWith(currentPrefix) && !msg.content.toLowerCase().startsWith("cp") || msg.author.bot) return;

  let prefixLength = msg.content.toLowerCase().startsWith(currentPrefix) ? currentPrefix.length : 2;
  if (!msg.content.toLowerCase().startsWith(currentPrefix)) {
    prefixLength = 2; // Default prefix length 'cp'
  }

  const args = msg.content.slice(prefixLength).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (!command) return;

  try {
    await command.execute({ client, Discord, ms, args, prefix: currentPrefix, msg });
  } catch (error) {
    console.error(error);
    return msg.reply('There was an error executing that command!');
  }

// level system
const xpPerLevel = (level) => {
   let xp = 5;
   return xp;
};

  // Fetch or create user data from the Level schema
  let user = await Level.findOne({ userId: msg.author.id });

  if (!user) {
    user = await Level.create({
      userId: msg.author.id,
      xp: 0,
      level: 1,
    });
  }

  user.xp += xpPerLevel(user.level); // Calculate XP based on the user's current level

  const xpToLevelUp = 20 + (user.level - 1) * 20;
  const xpNeeded = xpToLevelUp;

  if (user.xp >= xpNeeded) {
    if (client.cooldowns.has(msg.author.id)) {
      const expirationTime = client.cooldowns.get(msg.author.id);
      const timeDifference = expirationTime - Date.now();

      if (timeDifference > 0) {
        return;
      }
    }

    // Check if the user's XP exceeds the needed XP for just one level increase
    if (user.xp >= xpNeeded) {
      user.xp -= xpNeeded;
      user.level++;

      // Update cooldown for further level increase after a certain time
      const cooldownTime = 60000; // 60 seconds cooldown
      client.cooldowns.set(msg.author.id, Date.now() + cooldownTime);

      const balanceToAdd =
        user.level === 2 ? 15000 : 15000 + (user.level - 2) * 5000;

      // Update user balance in the User schema
      const updatedUserBalance = await User.findOneAndUpdate(
        { userId: msg.author.id },
        { $inc: { balance: balanceToAdd } },
        { upsert: true, new: true }
      );

      const oldLevel = user.level - 1; // Fetch the old level

      const levelUp = await new canvafy.LevelUp()
        .setAvatar(
          msg.author.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 128,
          })
        ) // Set user's avatar
        .setBackground(
          "image",
          "https://cdn.discordapp.com/attachments/1209078672993165312/1231482598358908968/images_1_3.jpg?ex=66371e8b&is=6624a98b&hm=da84ff6ce1bb8c1e457a9f2c87f5ff1d57d3f41ad42b74afffc82a2d2ee5842c&"
        )
        .setUsername(`${msg.author.username}`)
        .setBorder("#000000")
        .setAvatarBorder("#ff0000")
        .setOverlayOpacity(0.7)
        .setLevels(oldLevel, user.level) // Set the old and new levels dynamically
        .build();

      msg.reply({
        content: `Congratulations! You received **__${balanceToAdd.toLocaleString()}__** ${currency} CP coins.`,
        files: [
          {
            attachment: levelUp,
            name: `levelup-${msg.member.id}.png`,
          },
        ],
      });

      user.xp = 0; // Reset XP after level up
      user.save();
    }
  } else {
    await user.save();
  }
});
