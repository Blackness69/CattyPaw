// xpHandler.js

const Level = require('../Schemas/economy/levelSchema');
const canvafy = require('canvafy');
const User = require('../Schemas/economy/userSchema');
const client = require(process.cwd() + '/index.js');
const { currency } = require('../config');

// Function to grant XP to a user
const grantXP = async (userId, xpToAdd = 4) => { // Add default value of 4 XP
  let user = await Level.findOne({ userId });
  if (!user) {
    user = await Level.create({
      userId,
      xp: 0,
      level: 1,
    });
  }
  user.xp += xpToAdd; // Add 4 XP
  await user.save();
};

// Function to handle level up
const handleLevelUp = async (msg, user) => {
  const xpToLevelUp = 80 + (user.level - 1) * 80;
  if (user.xp >= xpToLevelUp) {
    user.xp -= xpToLevelUp;
    user.level++;

    const cooldownTime = 30000; // 30 seconds cooldown
    client.cooldowns.set(msg.author.id, Date.now() + cooldownTime);

    const balanceToAdd = user.level === 2 ? 15000 : 15000 + (user.level - 2) * 5000;

    await User.findOneAndUpdate(
      { userId: msg.author.id },
      { $inc: { balance: balanceToAdd } },
      { upsert: true, new: true }
    );

    const oldLevel = user.level - 1;

    const levelUp = await new canvafy.LevelUp()
      .setAvatar(
        msg.author.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 128,
        })
      )
      .setBackground(
        "image",
        "https://i.pinimg.com/originals/27/2e/74/272e74c0d96d36031c054ac6421b971e.gif"
      )
      .setUsername(`${msg.author.username}`)
      .setBorder("#000000")
      .setAvatarBorder("#ff0000")
      .setOverlayOpacity(0.7)
      .setLevels(oldLevel, user.level)
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

    user.xp = 0;
    await user.save();
  } else {
    await user.save();
  }
};

module.exports = { grantXP, handleLevelUp };