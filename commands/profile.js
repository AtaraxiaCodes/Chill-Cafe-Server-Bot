const db = require('quick.db');
const discord = require('discord.js');
const { getInfo } = require('../util/LevelUtil.js');
module.exports = {
	name: 'level',
	description: 'Get the level of author or mentioned',
	execute(client, message, args) {
		const user = message.mentions.users.first() || message.author;

		if (user.id === client.user.id) {
			//IF BOT
			return message.channel.send("😉 | I'm too good for levels");
		}

		if (user.bot) {
			return message.channel.send('Bot do not have levels');
		}

		let xp = db.get(`xp_${user.id}_${message.guild.id}`) || 0;

		const { level, remxp, levelxp } = getInfo(xp);
		if (xp === 0)
			return message.channel.send(`**${user.tag}** is out of the xp`);

		let profileEmbed = new discord.MessageEmbed()
			.setAuthor(user.username, message.guild.iconURL())
			.setColor('#000FF0')
			.setThumbnail(user.avatarURL()).setDescription(`**LEVEL** - ${level}
**XP** - ${remxp}/${levelxp}`);

		message.channel.send(profileEmbed);
	}
};
