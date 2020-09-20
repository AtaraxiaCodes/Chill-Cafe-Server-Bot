module.exports = {
	name: 'ban',
	description: 'Ban a member from the server',
	guildOnly: true,
	execute(message, args) {
		if (!message.guild) return;
		if (message.content.startsWith(`${prefix}ban`)) {
			const user = message.mentions.users.first();
			if (user) {
				const member = message.guild.member(user);
				if (member) {
					member
						.ban({
							reason: 'They were naughty!'
						})
						.then(() => {
							message.reply(`Successfully banned ${user.tag}`);
							console.log('Banned User');
						})
						.catch(err => {
							message.reply('I was unable to ban the member');
							console.error(err);
						});
				} else {
					message.reply("That user isn't in this server!");
				}
			} else {
				message.reply("You didn't mention the user to ban!");
			}
		}
	}
};
