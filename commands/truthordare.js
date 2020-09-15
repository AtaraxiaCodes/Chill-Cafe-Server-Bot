module.exports = {
	name: 'truthordare',
	description: 'Fun Truth or Dare Command',
	execute(message, args) {
		let retruth = [
			'Do you like playing Minecraft?',
			'Do you love anyone?',
			'Are you dating someone?',
			'You have a friend, and your friend has robbed a shop. What do you do?',
			'Have you stole anything?',
			'Your friend says, do you have any money for buy candy. What do you do?',
			'What you were doing in bathroom?'
		];
		let truth = Math.floor(Math.random() * Math.floor(retruth.length));

		let redare = [
			'Go to your parents and tell about your pranks!',
			'Say to your friend: "I love you xD"',
			'Start your computer and say loudly "I DON\'T LIKE YOU..."',
			'Go to your bed, and speak with yourself!',
			'You must replace your profile picture to [this](https://imgur.com/gallery/IDc8oMJ)!'
		];
		let dare = Math.floor(Math.random() * Math.floor(redare.length));

		const pagetruth = new discord.MessageEmbed();
		pagetruth.setColor('#0000FF');
		pagetruth.setAuthor(
			'Server Bot',
			'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
		);
		pagetruth.setTitle('You choose: Truth!');
		pagetruth.setDescription(
			`${retruth[truth]}\n☞ *You have to speak the truth, please tell!*`
		);
		pagetruth.setTimestamp();

		const pagedare = new discord.MessageEmbed();
		pagedare.setColor('#0000FF');
		pagedare.setAuthor(
			'Server Bot',
			'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
		);
		pagedare.setTitle('You choose: Dare');
		pagedare.setDescription(
			`${redare[dare]}\n☞ *You have a dare, go and do it!*`
		);
		pagedare.setTimestamp();

		try {
			const main = new discord.MessageEmbed();
			main.setColor('#0000FF');
			main.setAuthor(
				'Server Bot',
				'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
			);
			main.setTitle('Truth or Dare Game Started!');
			main.setDescription(
				'What you want to choice?\n\n**Truth** = 😇\n**Dare** = 👿\n\n*Please react with an emoji to contine!*'
			);
			main.setTimestamp();

			var mainMessage = message.channel.send(main);
			mainMessage.react('😇');
			mainMessage.react('👿');
			setTimeout(() => {
				mainMessage.reactions
					.removeAll()
					.catch(error => console.error('Failed to clear reactions: ', error));
			}, 150000);
		} catch (error) {
			console.error(error);
		}

		const filter = (reaction, user) => user.id !== message.client.user.id;
		const collector = mainMessage.createReactionCollector(filter, {
			time: 150000
		});

		collector.on('collect', (reaction, reactionCollector) => {
			switch (reaction.emoji.name) {
				case '😇':
					mainMessage.edit(pagetruth);
					mainMessage.reactions
						.removeAll()
						.catch(error =>
							console.error('Failed to clear reactions: ', error)
						);
					break;

				case '👿':
					mainMessage.edit(pagedare);
					mainMessage.reactions
						.removeAll()
						.catch(error =>
							console.error('Failed to clear reactions: ', error)
						);
					break;

				default:
					break;
			}
		});
	},
};