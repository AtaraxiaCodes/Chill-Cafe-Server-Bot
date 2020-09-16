const discord = require('discord.js');

module.exports = {
	name: 'whois',
	description: 'Gives information on a specified member',
	cooldown: 5,
	execute(message, args) {
		mention = message.mentions.users.first(); //look for mentions in the message
		if (!mention) return message.channel.send('No user found with that name!');

		let member = message.mentions.members.first();
		let date = new Date(member.joinedAt);
		let date_formatted =
			date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		let all_roles = message.guild.roles.map(u => {
			return u.name;
		});
		let member_roles = [];
		for (var x in all_roles) {
			let role = member.guild.roles.find('name', all_roles[x]);
			if (member.roles.has(role.id)) {
				member_roles.push(role);
			}
		}
		let whois = new discord.MessageEmbed()
			.color('#3447003')
			.author(member.user, member.user.avatarURL)
			.thumbnail(member.user.avatarURL)
			.addfields(
				{
					name: '__**Roles**__',
					value:
						member_roles
							.toString()
							.split(',')
							.slice(1, 4)
							.join('-') + '\n'
				}, //Remove first because it's @everyone
				{
					name: '__**Information**__',
					value:
						'**`Server Muted: `**' +
						member.serverMute +
						'\n**`Server Deafened: `**' +
						member.serverMute +
						'\n**`Joined On: `**' +
						date_formatted,
					inline: true
				},
				{
					name: '__**Status**__',
					value:
						'**`Current Status: `**' +
						member.presence.status +
						'\n**`Voice Channel: `**' +
						member.voiceChannel +
						'\n**`User ID: `**' +
						member.id,
					inline: true
				}
			)
			.description('<@' + member.id + '>')
			.timestamp(new Date());

		message.channel.send(whois);
	}
};
