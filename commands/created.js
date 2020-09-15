module.exports = {
	name: 'created',
	description: 'Displays Server Creation Date',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`Created On ${message.guild.createdAt}`);
    console.log(`Creation Dage command used by ${message.author.username}`);
	},
};