const { ActivityType, ChannelType } = require('discord.js');
const colors = require('colors');
var AsciiTable = require('ascii-table');
const { AutoPoster } = require('topgg-autoposter');
var table = new AsciiTable();
table.setHeading('Mongo Database', 'Stats').setBorder('|', '=', "0", "0");
const mongoose = require('mongoose');
const { mongoURL } = require('../config.js');
const client = require(process.cwd() + '/index.js')

client.on("ready", async (client) => {
  const serverCount = client.guilds.cache.size;
  client.user.setActivity({
    name: 'cp help',
    type: ActivityType.Watching,
  });
  await client.application.commands.set(client.slashCommands.map(command => command.data));

  if (!mongoURL) {
    console.log(colors.magenta('Mongo Database • Disconnected'))
    console.log(colors.magenta('0===========================0'));
  } else {
    await mongoose.connect(mongoURL);
    console.log(colors.magenta('Mongo Database • Connected'))
    console.log(colors.magenta('0===========================0'));
  };
  if (!client.slashCommands) {
    console.log(colors.blue('Slash Commands • Not Registered'))
    console.log(colors.blue('0===========================0'));
  } else {
    console.log(colors.blue('Slash Commands • Registered'))
    console.log(colors.blue('0===========================0'));
  }
  if (client) {
    console.log(colors.red(`${client.user.tag} • Online`))
    console.log(colors.red('0===========================0'));
    } else {
      console.log(colors.red(`Client not found`));
    console.log(colors.red('0===========================0'));
    }
  const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMjk0MzgzMjEzOTUxMDk5MjkiLCJib3QiOnRydWUsImlhdCI6MTcxMzI4OTA0OX0.CO1zmripuT5D-pWDuUbbEDpt4YYcLCIcB9V8Y0_0IG4', client);

  ap.on('posted', () => {
    console.log(colors.blue(`Stats posted on top.gg`));
    
    console.log(colors.blue('0===========================0'));
  });
});
