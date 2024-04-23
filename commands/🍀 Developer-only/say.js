const { ownerIds } = require('../../config');

module.exports = {
  name: 'say',
  description: 'Make the bot say something.',
  async execute({msg, args}) {
if (!ownerIds.includes(msg.author.id)) return;
    
    const message = args.join(' ');
    if (!message) return msg.reply('Pleasep provide something to say').then((message) => {
      setTimeout(() => {
        message.delete();
      }, 4000)
    });
    msg.delete();
    msg.channel.send(`${message}`);
  }
}