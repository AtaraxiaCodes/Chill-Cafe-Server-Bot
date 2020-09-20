module.exports = {
	name: 'ping',
	description: 'Ping for testing',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Pong.');
	}
};
