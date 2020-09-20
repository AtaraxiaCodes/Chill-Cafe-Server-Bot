module.exports = {
	name: 'unmute',
	description: 'Unmute a person in the server',
	execute(message, args) {
		const discord = require('discord.js');
		const { mutedRoleID } = require('./config.json');
		if (
			!message.member.hasPermission('MANAGE_ROLES') ||
			!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) ||
			!message.guild.owner
		)
			return message.reply("You haven't the permission to use this command!");
		if (!message.guild.me.hasPermission(['MANAGE_ROLES', 'ADMINISTRATOR']))
			return message.reply("I don't have permission to manage roles!");
		let toUnmute = message.mentions.members.first();
		if (!toUnmute) return message.reply('Supply a user to be unmuted');
		let muteRole = mutedRoleID;
		const unmuteConfirm = new discord.MessageEmbed()
			.setColor('#0099ff')
			.setDescription(
				`✅ ${toUnmute.user.username} has been successfully unmuted!`
			);
		toUnmute.roles.remove(muteRole.id).then(() => {
			message.delete();
			toUnmute.send(`You have been unmuted in **${message.guild.name}**`);
			message.channel.send(unmuteConfirm);
		});
	}
};
