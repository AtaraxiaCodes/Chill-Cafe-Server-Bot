module.exports = {
	name: 'membercount',
	description: 'Displays Member Count',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`Total members: ${message.guild.memberCount}`);
    console.log(`Member Count command used by ${message.author.username}`);
	},
};