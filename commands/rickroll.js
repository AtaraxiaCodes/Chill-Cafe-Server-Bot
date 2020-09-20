module.exports = {
	name: 'rickroll',
	description: 'Plays Rickroll in VC',
	cooldown: 5,
	execute(message, args) {
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.reply('Please join a voice channel first!');
		}

		voiceChannel.join().then(connection => {
			const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
				filter: 'audioonly'
			});
			const dispatcher = connection.play(stream);
			console.log(`Rickrolled ${message.author.username}`);

			dispatcher.on('finish', () => voiceChannel.leave());
		});
	}
};
