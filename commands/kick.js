module.exports = {
	name: 'kick',
	description: 'Kick a member from the server',
	guildOnly: true,
	execute(message, args) {
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);

			if (member) {
				member
					.kick('Optional reason that will display in the audit logs')
					.then(() => {
						message.reply(`Successfully kicked ${user.tag}`);
						console.log('Kicked User');
					})
					.catch(err => {
						message.reply('I was unable to kick the member');
						console.error(err);
					});
			} else {
				message.reply("That user isn't in this server!");
			}
		} else {
			message.reply("You didn't mention the user to kick!");
		}
	}
};
