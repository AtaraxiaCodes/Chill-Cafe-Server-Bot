module.exports = {
	name: '8ball',
	description: 'Fun 8 Ball Command',
	cooldown: 5,
	execute(message, args) {
		const answers = ['Yes', 'No', 'Maybe', 'Probably', 'Probably not'];
		let messageArray = message.content.split(' ');
		let command = messageArray[0];
		let arg = messageArray.slice(1);
		let com = command.toLowerCase();
		var sender = message.author;

		// Runs if user doesn't ask a question
		if (!arg[0]) {
			message.channel.send('Please ask a question.');
			return;
		}
		// Creates an embed and picks a random answer from the answer array
		let eightballEmbed = new discord.MessageEmbed()
			.addField('Question', arg)
			.addField('Answer', answers[Math.floor(Math.random() * answers.length)])
			.setColor('42c2f4');
		message.channel.send(eightballEmbed);
		return console.log(`8ball command used by ${msg.author.username}`);
	}
};
