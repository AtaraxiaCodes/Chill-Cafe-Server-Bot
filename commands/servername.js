module.exports = {
	name: 'servername',
	description: 'Displays Server Name',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`This server's name is: ${message.guild.name}`);
		console.log(`Server Name command used by ${message.author.username}`);
	},
};