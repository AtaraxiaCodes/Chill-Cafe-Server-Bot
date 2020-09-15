module.exports = {
	name: 'profile',
	description: 'Sends Profile Embed',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(profileEmbed); //Send Profile Embed
    console.log('Profile Displayed');
    console.log(`Profile command used by ${message.author.username}`);
	},
};