const discord = require('discord.js');
const client = new discord.Client();

const canvas = require('canvas');

const ytdl = require('ytdl-core');
const queue = new Map();

const https = require('https'),
	fs = require('fs');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.end();
});

app.listen(8080);

client.on('ready', () => {
	console.log('Bot Running!');
});

const config = require('./config.json'),
	Parser = require('rss-parser'),
	parser = new Parser(),
	Youtube = require('simple-youtube-api'),
	youtube = new Youtube(config.youtubeKey);

//prefix
const prefix = '%';

//Help Embed
const helpEmbed1 = new discord.MessageEmbed()
	.setTitle('Help Documentation')
	.setAuthor(
		'Server Bot',
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.setColor('#00ffff')
	.setDescription('Server Stat Commands')
	.setThumbnail(
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.addFields(
		{ name: `${prefix}ping`, value: 'Test Ping' },
		{ name: `${prefix}server`, value: 'Displays Server Name' },
		{ name: `${prefix}member`, value: 'Displays Member Count' },
		{ name: `${prefix}created`, value: 'Displays Creation Date' },
		{ name: `${prefix}help`, value: 'DMs Help Documentation' },
		{ name: `${prefix}profile`, value: 'Displays Rank and Level Data (WIP)' }
	);

const helpEmbed2 = new discord.MessageEmbed()
	.setTitle('Help Documentation')
	.setAuthor(
		'Server Bot',
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.setColor('#00ffff')
	.setDescription('Fun Commands')
	.setThumbnail(
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.addFields(
		{ name: `${prefix}rickroll`, value: 'Plays the Rickroll in VC' },
		{ name: `${prefix}8ball`, value: 'Play an 8 Ball Game' },
		{ name: `${prefix}tdgame`, value: 'Play a Truth or Dare Game' },
		{ name: `${prefix}minesweeper`, value: 'Play a Minesweeper Game' }
	);

const helpEmbed4 = new discord.MessageEmbed()
	.setTitle('Help Documentation')
	.setAuthor(
		'Server Bot',
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.setColor('#00ffff')
	.setDescription('Stream Notification Commands')
	.setThumbnail(
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.addFields(
		{ name: `${prefix}add <twitchchannel>`, value: 'Add Your Twitch Channel' },
		{ name: `${prefix}remove <twitchchannel>`, value: 'Remove Your Twitch Channel'},
		{ name: `${prefix}list`, value: 'List All Twitch Channels and Status' }
	);

const helpEmbed3 = new discord.MessageEmbed()
	.setTitle('Help Documentation')
	.setAuthor(
		'Server Bot',
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.setColor('#00ffff')
	.setDescription('Music Commands')
	.setThumbnail(
		'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
	)
	.addFields(
		{ name: `${prefix}play <url>`, value: 'Plays Song w/ Provide YT URL' },
		{ name: `${prefix}skip`, value: 'Skips Current Song' },
		{ name: `${prefix}stop`, value: 'Clears Queue and Exits VC' }
	);

// level * levelrate = how much xp you need to get to the next level
const levelrate = 20;

// How much xp you get from each message
const msgxp = 1;

function userExists(id) {
	// Read the file and parse it
	let data = JSON.parse(fs.readFileSync('data.json'));

	return data[id] != null;
}

function updateUser(id, profile) {
	let data = JSON.parse(fs.readFileSync('data.json'));

	data[id] = profile;

	// Update the file
	fs.writeFileSync('data.json', JSON.stringify(data));
}

function getUser(id) {
	let data = JSON.parse(fs.readFileSync('data.json'));

	return data[id];
}

//Rank up and Level Up Messages
client.on('message', msg => {
	if (msg.author.client) return;
	if (msg.channel.type === 'dm') return;

	if (userExists(msg.author.id)) {
		let user = getUser(msg.author.id);
		let elderRole = msg.guild.roles.cache.find(
			role => role.id == '734189094271320195'
		);
		let legendRole = msg.guild.roles.cache.find(
			role => role.id == '734189143965564939'
		);
		let veteranRole = msg.guild.roles.cache.find(
			role => role.id == '734188797960388628'
		);

		user.xp += msgxp;
		let levelUp = user.level * levelrate - user.xp;

		//(UNTESTED) Profile Embed
		const profileEmbed = new discord.MessageEmbed()
			.setTitle('Profile')
			.setAuthor(
				'Server Bot',
				'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
			)
			.setColor('#00ffff')
			.setDescription('chill cafe™')
			.setThumbnail(
				'https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342'
			)
			.addFields(
				{ name: `Current Rank`, value: 'Coming Soon' },
				{ name: `Current Level`, value: `${user.level}` },
				{
					name: `XP to Level Up`,
					value: `${user.level} * ${levelrate} - ${user.xp}`
				}
			);

		if (user.xp >= levelrate * user.level) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You leveled up! You are now level ${++user.level}`
			);
			user.xp = 0;
			console.log(`${msg.author.username} Leveled Up`);
		}

		if (user.level == 5) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189094271320195>`
			);
			msg.member.role.add(elderRole);
			console.log(`${msg.author.username} Ranked Up`);
		}

		if (user.level == 10) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189143965564939>`
			);
			msg.member.role.add(legendRole);
			console.log(`${msg.author.username} Ranked Up`);
		}

		if (user.level == 15) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734188797960388628>`
			);
			msg.member.role.add(veteranRole);
			console.log(`${msg.author.username} Ranked Up`);
		}

		updateUser(msg.author.id, user);
	} else {
		updateUser(msg.author.id, { xp: 0, level: 1 });
	}

	//(UNTESTED) Welcome Message
	client.on('guildMemberAdd', async member => {
		const channel = member.guild.channels.cache.find(
			ch => ch.name === '⌇😎⌇-public-chat'
		);
		if (!channel) return;
		channel.send(`Welcome to the server, ${member}`);
		console.log('Member Joined');
	});

	//(UNTESTED) Welcome Message w/ canvas
	client.on('guildMemberAdd', async member => {
		const channel = member.guild.channels.cache.find(
			ch => ch.name === '⌇😎⌇-public-chat'
		);
		if (!channel) return;

		const canvas = canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await canvas.loadImage(
			'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/735e5caa-855e-4c0d-8d02-9f8946e87f0b/dc0p8v9-d57bd85c-ae41-4d4e-bad6-2d81c71ba3c8.png/v1/fill/w_1096,h_729,strp/_c__the_library_cafe_by_malthuswolf_dc0p8v9-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD04NTEiLCJwYXRoIjoiXC9mXC83MzVlNWNhYS04NTVlLTRjMGQtOGQwMi05Zjg5NDZlODdmMGJcL2RjMHA4djktZDU3YmQ4NWMtYWU0MS00ZDRlLWJhZDYtMmQ4MWM3MWJhM2M4LnBuZyIsIndpZHRoIjoiPD0xMjgwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.z6JBFocchK7qkHrCiDDxnKhktaRqlpbxkYNrZyWbS6A'
		);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#00FFFF';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		// Slightly smaller text placed above the member's display name
		ctx.font = '28px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			'Welcome to the server,',
			canvas.width / 2.5,
			canvas.height / 3.5
		);

		// Add an exclamation point here and below
		ctx.font = applyText(canvas, `${member.displayName}!`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`${member.displayName}!`,
			canvas.width / 2.5,
			canvas.height / 1.8
		);

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(
			member.user.displayAvatarURL({ format: 'jpg' })
		);
		ctx.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new discord.MessageAttachment(
			canvas.toBuffer(),
			'welcome-image.png'
		);

		channel.send(`Welcome to the server, ${member}!`, attachment);
	});

	//General Text Commands
	if (msg.content == `${prefix}ping`) {
		msg.channel.send('Pong!'); //Ping for test
		console.log(`Ping command used by ${msg.author.username}`);
	} else if (msg.content == `${prefix}server`) {
		msg.channel.send(`This server's name is: ${msg.guild.name}`); //Server Name
		console.log(`Server Name command used by ${msg.author.username}`);
	} else if (msg.content == `${prefix}member`) {
		msg.channel.send(`Total members: ${msg.guild.memberCount}`); //Member Count
		console.log(`Member Count command used by ${msg.author.username}`);
	} else if (msg.content == `${prefix}created`) {
		msg.channel.send(`Created On ${msg.guild.createdAt}`); //Creation Date
		console.log(`Creation Dage command used by ${msg.author.username}`);
	} else if (msg.content == `${prefix}help`) {
		msg.author.send(helpEmbed1); //DM Server Stat Help Embed
		msg.author.send(helpEmbed2); //DM Fun Help Embed
		msg.author.send(helpEmbed3); //DM Music Help Embed
		msg.author.send(helpEmbed3); //DM Stream Notification Help Embed
		console.log(`Help command used by ${msg.author.username}`);
	} else if (msg.content == `${prefix}profile`) {
		msg.channel.send(profileEmbed); //Send Profile Embed
		console.log('Profile Displayed');
		console.log(`Profile command used by ${msg.author.username}`);
	}
});

//(UNTESTED) Play Youtube Music
client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	//Listens for Commands
	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} else {
		message.channel.send('You need to enter a valid command!');
	}
});

//Arguments for Music
async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel)
		return message.channel.send(
			'You need to be in a voice channel to play music!'
		);
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			'I need the permissions to join and speak in your voice channel!'
		);
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		return message.channel.send(`${song.title} has been added to the queue!`);
		console.log(`${song.title} is in song queue.`);
	}
}

//Skips Music
function skip(message, serverQueue) {
	if (!message.member.voice.channel)
		return message.channel.send(
			'You have to be in a voice channel to stop the music!'
		);
	if (!serverQueue)
		return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

//Stops Music & Exits VC
function stop(message, serverQueue) {
	if (!message.member.voice.channel)
		return message.channel.send(
			'You have to be in a voice channel to stop the music!'
		);
	serverQueue.songs = [];
	console.log('Cleared Queue');
	serverQueue.connection.dispatcher.end();
	console.log('Exited VC');
}

//Plays Music
function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection
		.play(ytdl(song.url))
		.on('finish', () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`Start playing: **${song.title}**`);
	console.log(`Playing ${song.title}`);
}

//(UNTESTED) Play The Rickroll From Youtube
client.on('message', async message => {
	if (message.content === `${prefix}rickroll`) {
		if (message.channel.type === 'dm') return;

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
});

//(UNTESTED) 8-Ball Command
const answers = ['Yes', 'No', 'Maybe', 'Probably', 'Probably not'];

client.on('message', async message => {
	// Checking if the author of the message is not a bot and is not sent in a DM channel
	if (message.author.client) return;
	if (message.channel.type === 'dm') return;

	let messageArray = message.content.split(' ');
	let command = messageArray[0];
	let arg = messageArray.slice(1);
	let com = command.toLowerCase();
	var sender = message.author;

	if (com == `${prefix}8ball`) {
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
});

//(UNTESTED) Truth or Dare Command
client.on('message', async message => {
	// Checking if the author of the message is not a bot and is not sent in a DM channel
	if (message.author.client) return;
	if (message.channel.type === 'dm') return;

	if (msg.content == `${prefix}tdgame`) {
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

			var mainMessage = await message.channel.send(main);
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
	}
});

//(UNTESTED) Minesweeper
client.on('message', msg => {
	if (msg.content.startsWith(`${prefix}minesweeper`)) {
		argDone = 0;
		msgArg = msg.content.substr(prefix.length + 1).split(' ');
		if (argTest(3)) {
			for (var i = 0; i < 3; i++) {
				if (
					!isNaN(Number(msgArg[i])) &&
					((4 <= Number(msgArg[i]) && Number(msgArg[i]) <= 16) ||
						(i == 2 && 0 <= Number(msgArg[i])))
				) {
					msgArg[i] = Math.floor(Number(msgArg[i]));
					argDone++;
				}
				if (msgArg[0] * msgArg[1] * 0.8 < msgArg[2]) {
					msgArg[2] = Math.floor(msgArg[0] * msgArg[1] * 0.8);
				}
			}
		}

		if (argDone == 3) {
			fieldArr = [];
			for (var i = 0; i < msgArg[1]; i++) {
				fieldArr.push([]);
			}
			for (var i = 0; i < msgArg[1]; i++) {
				for (var j = 0; j < msgArg[0]; j++) {
					fieldArr[i].push(10);
				}
			}
			mineCount = msgArg[2];
			loopCount = 0;
			while (mineCount > 0) {
				pointThisX = Math.floor(Math.random() * msgArg[0]);
				pointThisY = Math.floor(Math.random() * msgArg[1]);
				if (fieldArr[pointThisY][pointThisX] != 11) {
					fieldArr[pointThisY][pointThisX] = 11;
					mineCount--;
				}
				loopCount++;
				if (loopCount >= 2000) {
					break;
				}
			}
			for (
				var i = Math.ceil(msgArg[0] / 2 - 2);
				i < Math.floor(msgArg[0] / 2 + 2);
				i++
			) {
				for (
					var j = Math.ceil(msgArg[1] / 2 - 2);
					j < Math.floor(msgArg[1] / 2 + 2);
					j++
				) {
					if (fieldArr[j][i] == 11) {
						msgArg[2]--;
					}
					fieldArr[j][i] = 10;
				}
			}
			for (var i = 0; i < msgArg[1]; i++) {
				for (var j = 0; j < msgArg[0]; j++) {
					if (fieldArr[i][j] != 11) {
						nearMine = 0;
						for (var k = 0; k < 3; k++) {
							if (
								(k == 0 && 0 < i) ||
								k == 1 ||
								(k == 2 && i < msgArg[1] - 1)
							) {
								if (0 < j) {
									if (fieldArr[i - 1 + k][j - 1] == 11) nearMine++;
								}
								if (fieldArr[i - 1 + k][j] == 11) nearMine++;
								if (j < msgArg[0]) {
									if (fieldArr[i - 1 + k][j + 1] == 11) nearMine++;
								}
							}
						}
						if (nearMine != 0) {
							fieldArr[i][j] = nearMine - 1;
						}
					}
				}
			}
			emojiArr = [];
			for (var i = 0; i < msgArg[1]; i++) {
				emojiArr.push([]);
			}
			for (var i = 0; i < msgArg[1]; i++) {
				for (var j = 0; j < msgArg[0]; j++) {
					emojiArr[i].push(0);
				}
			}
			for (var i = 0; i < msgArg[1]; i++) {
				for (var j = 0; j < msgArg[0]; j++) {
					switch (fieldArr[i][j]) {
						case 10:
							emojiArr[i][j] = tileEmoji;
							break;
						case 11:
							emojiArr[i][j] = mineEmoji;
							break;
						default:
							emojiArr[i][j] = numEmoji[fieldArr[i][j]];
					}
				}
			}
			for (var i = 0; i < msgArg[1]; i++) {
				for (var j = 0; j < msgArg[0]; j++) {
					emojiArr[i][j] = '||' + emojiArr[i][j] + '||';
				}
			}
			for (
				var i = Math.ceil(msgArg[0] / 2 - 2);
				i < Math.floor(msgArg[0] / 2 + 2);
				i++
			) {
				for (
					var j = Math.ceil(msgArg[1] / 2 - 2);
					j < Math.floor(msgArg[1] / 2 + 2);
					j++
				) {
					emojiArr[j][i] = emojiArr[j][i].replace(/\|\|/g, '');
				}
			}
			heightLeft = msgArg[1];
			heightDone = 0;
			for (var i = 0; i < Math.ceil(fieldArr.length / 4); i++) {
				msgToSend = '';
				heightThis = Math.min(heightLeft, 4);
				heightLeft -= heightThis;
				for (var j = heightDone; j < heightDone + heightThis; j++) {
					for (var k = 0; k < msgArg[0]; k++) {
						msgToSend += emojiArr[j][k];
					}
					msgToSend += '\n';
				}
				heightDone += heightThis;
				msg.channel.send(msgToSend);
			}
			msg.channel.send(
				'**Size: ' +
					msgArg[0] +
					'x' +
					msgArg[1] +
					'**\n**Mine Count: ' +
					msgArg[2] +
					'**\n**Have fun :D**'
			);
		} else {
			msgToSend = new discord.MessageEmbed()
				.setColor('#121212')
				.setAuthor('How to use', '')
				.setDescription(
					'-g {width(min:4,max:16)} {height(min:4,max:16)} {mine}'
				);
			msg.channel.send(msgToSend);
		}
	}
});

function varSet() {
	tileEmoji = '<:t_:750200739380330526>';
	mineEmoji = '<:m_:750200739674062900>';
	numEmoji = [
		'<:1_:750200739132997663>',
		'<:2_:750200738927345686>',
		'<:3_:750200739296575579>',
		'<:4_:750200739720069190>',
		'<:5_:750200739338387576>',
		'<:6_:750200739330261063>',
		'<:7_:750200739242180660>',
		'<:8_:750200739187654677>',
		'<:9_:750200739363684454>'
	];
}
function argTest(num) {
	for (var i = 0; i < num; i++) {
		if (msgArg[i] === undefined) {
			return 0;
		}
	}
	return 1;
}

//(UNTESTED) Infection Game
async function getInfectedFunction(message) {
    let author = message.author.id;
    let member = message.mentions.users.first();
    if(!member) return;
    let infection = config.infectionRoleID;
    if (message.guild.members.cache.get(author).roles.cache.get(infection)) return;
    if (message.guild.members.cache.get(member.id).roles.cache.get(infection)) {
        let chance = Math.random() * 100;
        if (chance <= 100) {
              await(message.guild.members.cache.get(author).roles.add(infection));
              message.channel.send(`<@${author}> has been infected!`);
              console.log(`${author} has been infected!`)
        };
    }
}

async function giveInfectionFunction(message) {
    let pingee = message.mentions.users.first();
    if(!pingee) return;
    let infection = config.infectionRoleID;
    if(message.guild.members.cache.get(pingee.id).roles.cache.get(infection)) return;
    if(message.member.roles.cache.get(infection)) {
        let chance = Math.random() * 100;
        if (chance <= 100) {
            await(message.guild.members.cache.get(pingee.id).roles.add(infection));
            message.channel.send(`<@${pingee.id}> has been infected by <@${message.author.id}>!`);
            console.log(`${pingee.id} has been infected by ${message.author.id}!`)
        };
    }
}

client.on("message", message => {
  if (message.channel.type === "dm") return;
  if (message.author.type === "bot") return;
  giveInfectionFunction(message);
  getInfectedFunction(message);
});

//(UNTESTED) Kick Members Command
client.on('message', message => {
	if (!message.guild) return;

	if (message.content.startsWith(`${prefix}kick`)) {
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
});

//(UNTESTED) Ban Members Command
client.on('message', message => {
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
});

//(WIP) Twitch Stream Messages - https://github.com/etacarinaea/discord-twitch-bot
const args = process.argv.slice(2),
	channelPath = __dirname + '/.channels',
	token = args[0],
	twitchClientID = args[1],
	interval = args[2] * 1000,
	apiUrl = 'https://api.twitch.tv/kraken',
	// two minutes
	timeout = 2 * 60 * 1000;
var servers = [];

function leadingZero(d) {
	if (d < 10) {
		return '0' + d;
	} else {
		return d;
	}
}

// adds a timestamp before msg/err
function print(msg, err) {
	var date = new Date();
	var h = leadingZero(date.getHours());
	var m = leadingZero(date.getMinutes());
	var s = leadingZero(date.getSeconds());

	console.log('[' + h + ':' + m + ':' + s + ']', msg);
	if (err) {
		console.log(err);
	}
}

function indexOfObjectByName(array, value) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].name.toLowerCase().trim() === value.toLowerCase().trim()) {
			return i;
		}
	}
	return -1;
}

function exitHandler(opt, err) {
	if (err) {
		print(err);
	}
	if (opt.save) {
		print('Saving channels to ' + channelPath + ' before exiting');
		print(JSON.stringify(servers));
		fs.writeFileSync(channelPath, JSON.stringify(servers, null, 4));
		print('Done');
	}
	if (opt.exit) {
		process.exit();
	}
}

process.on('exit', exitHandler.bind(null, { save: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGTERM', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

function callApi(server, twitchChannel, callback, getStreamInfo) {
	var opt;
	try {
		var apiPath;
		if (getStreamInfo) {
			apiPath = '/kraken/streams/' + twitchChannel.name.trim();
		} else {
			apiPath = '/kraken/channels/' + twitchChannel.name.trim();
		}
		opt = {
			host: 'api.twitch.tv',
			path: apiPath,
			headers: {
				'Client-ID': twitchClientID,
				Accept: 'application/vnd.twitchtv.v3+json'
			}
		};
	} catch (err) {
		print(err);
		return;
	}

	https
		.get(opt, res => {
			var body = '';

			res.on('data', chunk => {
				body += chunk;
			});

			res.on('end', () => {
				var json;
				try {
					json = JSON.parse(body);
				} catch (err) {
					print(err);
					return;
				}
				if (json.status == 404) {
					callback(server, undefined, undefined);
				} else {
					callback(server, twitchChannel, json);
				}
			});
		})
		.on('error', err => {
			print(err);
		});
}

function apiCallback(server, twitchChannel, res) {
	if (
		res &&
		!twitchChannel.online &&
		res.stream &&
		twitchChannel.timestamp + timeout <= Date.now()
	) {
		try {
			var channels = [],
				defaultChannel;
			var guild = client.guilds.find('name', server.name);

			if (server.discordChannels.length === 0) {
				defaultChannel = guild.channels.find('type', 'text');
			} else {
				for (let i = 0; i < server.discordChannels.length; i++) {
					channels.push(guild.channels.find('name', server.discordChannels[i]));
				}
			}
			var twitchEmbed = new discord.MessageEmbed()
				.setColor('#9689b9')
				.setTitle(res.stream.channel.display_name.replace(/_/g, '\\_'))
				.setURL(res.stream.channel.url)
				.setDescription(
					'**' + res.stream.channel.status + '**\n' + res.stream.game
				)
				.setImage(res.stream.preview.large)
				.setThumbnail(res.stream.channel.logo)
				.addField('Viewers', res.stream.viewers, true)
				.addField('Followers', res.stream.channel.followers, true);

			if (channels.length !== 0) {
				for (let i = 0; i < channels.length; i++) {
					channels[i]
						.sendEmbed(twitchEmbed)
						.then(print("Sent embed to channel '" + channels[i].name + "'."));
				}
				twitchChannel.online = true;
				twitchChannel.timestamp = Date.now();
			} else if (defaultChannel) {
				defaultChannel
					.sendEmbed(twitchEmbed)
					.then(print("Sent embed to channel '" + defaultChannel.name + "'."));
				twitchChannel.online = true;
				twitchChannel.timestamp = Date.now();
			}
		} catch (err) {
			print(err);
		}
	} else if (res.stream === null) {
		twitchChannel.online = false;
	}
}

function tick() {
	for (let i = 0; i < servers.length; i++) {
		for (let j = 0; j < servers[i].twitchChannels.length; j++) {
			for (let k = -1; k < servers[i].discordChannels.length; k++) {
				if (servers[i].twitchChannels[j]) {
					callApi(servers[i], servers[i].twitchChannels[j], apiCallback, true);
				}
			}
		}
	}
}

client.on('message', message => {
	var server, twitchChannels;
	if (!message.guild) {
		return;
	} else {
		let index = indexOfObjectByName(servers, message.guild.name);
		if (index == -1) {
			servers.push({
				name: message.guild.name,
				lastPrefix: '!',
				prefix: '/',
				role: 'botadmin',
				discordChannels: [],
				twitchChannels: []
			});
			index = servers.length - 1;
		}

		server = servers[index];
		twitchChannels = servers[index].twitchChannels;
	}

	if (message.content[0] == server.prefix) {
		var permission;
		try {
			permission = message.member.roles.exists('name', server.role);
		} catch (err) {
			print(server.role + ' is not a role on the server', err);
		}

		let index;
		var streamer;
		if (message.content.substring(1, 7) == 'remove') {
			if (permission) {
				streamer = message.content.slice(7).trim();
				index = indexOfObjectByName(twitchChannels, streamer);
				if (index != -1) {
					twitchChannels.splice(index, 1);
					index = indexOfObjectByName(twitchChannels, streamer);
					if (index == -1) {
						message.reply('Removed ' + streamer + '.');
					} else {
						message.reply(streamer + " isn't in the list.");
					}
				} else {
					message.reply(streamer + " isn't in the list.");
				}
			} else {
				message.reply('You need the role ' + server.role + '.');
			}
		} else if (message.content.substring(1, 4) == 'add') {
			if (permission) {
				streamer = message.content.slice(4).trim();
				var channelObject = { name: streamer };
				index = indexOfObjectByName(twitchChannels, streamer);
				callApi(
					server,
					channelObject,
					(serv, chan, res) => {
						if (index != -1) {
							message.reply(streamer + ' is already on the list.');
						} else if (res) {
							twitchChannels.push({
								name: streamer,
								timestamp: 0,
								online: false
							});
							message.reply('Added ' + streamer + '.');
							tick();
						} else {
							message.reply(streamer + " doesn't seem to exist.");
						}
					},
					false
				);
			} else {
				message.reply('You need the role ' + server.role + '.');
			}
		} else if (message.content.substring(1, 5) == 'list') {
			let msg = '\n';
			for (let i = 0; i < twitchChannels.length; i++) {
				var streamStatus;
				if (twitchChannels[i].online) {
					msg += '**' + twitchChannels[i].name + ' online**\n';
				} else {
					streamStatus = 'offline';
					msg += twitchChannels[i].name + ' offline\n';
				}
			}
			if (!msg) {
				message.reply('The list is empty.');
			} else {
				message.reply(msg.replace(/_/g, '\\_'));
			}
		} else if (message.content.substring(1, 10) == 'configure') {
			let msg = '';
			if (message.guild.owner == message.member) {
				if (message.content.substring(11, 15) == 'list') {
					msg +=
						'```\n' +
						'prefix    ' +
						server.prefix +
						'\n' +
						'role      ' +
						server.role +
						'\n';

					msg += 'channels  ' + server.discordChannels[0];
					if (server.discordChannels.length > 1) {
						msg += ',';
					}
					msg += '\n';

					for (let i = 1; i < server.discordChannels.length; i++) {
						msg += '          ' + server.discordChannels[i];
						if (i != server.discordChannels.length - 1) {
							msg += ',';
						}
						msg += '\n';
					}
					msg += '```';
				} else if (message.content.substring(11, 17) == 'prefix') {
					let newPrefix = message.content.substring(18, 19);
					if (newPrefix.replace(/\s/g, '').length === 0) {
						msg += 'Please specify an argument';
					} else if (newPrefix == server.prefix) {
						msg += 'Prefix already is ' + server.prefix;
					} else {
						server.lastPrefix = server.prefix;
						server.prefix = newPrefix;
						msg += 'Changed prefix to ' + server.prefix;
					}
				} else if (message.content.substring(11, 15) == 'role') {
					if (message.content.substring(16).replace(/\s/g, '').length === 0) {
						msg += 'Please specify an argument';
					} else {
						server.role = message.content.substring(16);
						msg += 'Changed role to ' + server.role;
					}
				} else if (message.content.substring(11, 18) == 'channel') {
					if (message.content.substring(19, 22) == 'add') {
						let channel = message.content.substring(23);
						if (channel.replace(/\s/g, '').length === 0) {
							msg += 'Please specify an argument';
						} else if (message.guild.channels.exists('name', channel)) {
							server.discordChannels.push(channel);
							msg += 'Added ' + channel + ' to list of channels to post in.';
						} else {
							msg += channel + ' does not exist on this server.';
						}
					} else if (message.content.substring(19, 25) == 'remove') {
						for (let i = server.discordChannels.length; i >= 0; i--) {
							let channel = message.content.substring(26);
							if (channel.replace(/\s/g, '').length === 0) {
								msg = 'Please specify an argument';
								break;
							} else if (server.discordChannels[i] == channel) {
								server.discordChannels.splice(i, 1);
								msg =
									'Removed ' + channel + ' from list of channels to post in.';
								break;
							} else {
								msg = channel + ' does not exist in list.';
							}
						}
					} else {
						msg = 'Please specify an argument for channel';
					}
				} else {
					msg +=
						'```\n' +
						'Usage: ' +
						server.prefix +
						'configure OPTION [SUBOPTION] VALUE\n' +
						'Example: ' +
						server.prefix +
						'configure channel add example\n' +
						'\nOptions:\n' +
						'  list        List current configurations\n' +
						'  prefix      Character to use in front of commands\n' +
						'  role        Role permitting usage of add and remove\n' +
						'  channel     Channel(s) to post in, empty list will use the first channel\n' +
						'      add         Add a discord channel to the list\n' +
						'      remove      Remove a discord channel from the list\n' +
						'```';
				}
			} else {
				msg += 'You are not the server owner.';
			}
			message.reply(msg);
		} else {
			message.reply(
				'Usage:\n' +
					server.prefix +
					'[configure args|list|add channel_name|remove channel_name]'
			);
		}
	} else if (message.content[0] == server.lastPrefix) {
		message.reply(
			'The prefix was changed from `' +
				server.lastPrefix +
				'` to `' +
				server.prefix +
				'`. Please use the new prefix.'
		);
	}
});

//(WIP) Youtube Notifier
const startAt = Date.now();
const lastVideos = {};

/**
 * Format a date to a readable string
 * @param {Date} date The date to format
 */
function formatDate(date) {
	let monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	let day = date.getDate(),
		month = date.getMonth(),
		year = date.getFullYear();
	return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
}

/**
 * Call a rss url to get the last video of a youtuber
 * @param {string} youtubeChannelName The name of the youtube channel
 * @param {string} rssURL The rss url to call to get the videos of the youtuber
 * @returns The last video of the youtuber
 */
async function getLastVideo(youtubeChannelName, rssURL) {
	console.log(`[${youtubeChannelName}]  | Getting videos...`);
	let content = await parser.parseURL(rssURL);
	console.log(
		`[${youtubeChannelName}]  | ${content.items.length} videos found`
	);
	let tLastVideos = content.items.sort((a, b) => {
		let aPubDate = new Date(a.pubDate || 0).getTime();
		let bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	console.log(
		`[${youtubeChannelName}]  | The last video is "${
			tLastVideos[0] ? tLastVideos[0].title : 'err'
		}"`
	);
	return tLastVideos[0];
}

/**
 * Check if there is a new video from the youtube channel
 * @param {string} youtubeChannelName The name of the youtube channel to check
 * @param {string} rssURL The rss url to call to get the videos of the youtuber
 * @returns The video || null
 */
async function checkVideos(youtubeChannelName, rssURL) {
	console.log(`[${youtubeChannelName}] | Get the last video..`);
	let lastVideo = await getLastVideo(youtubeChannelName, rssURL);
	// If there isn't any video in the youtube channel, return
	if (!lastVideo) return console.log('[ERR] | No video found for ' + lastVideo);
	// If the date of the last uploaded video is older than the date of the bot starts, return
	if (new Date(lastVideo.pubDate).getTime() < startAt)
		return console.log(
			`[${youtubeChannelName}] | Last video was uploaded before the bot starts`
		);
	let lastSavedVideo = lastVideos[youtubeChannelName];
	// If the last video is the same as the last saved, return
	if (lastSavedVideo && lastSavedVideo.id === lastVideo.id)
		return console.log(
			`[${youtubeChannelName}] | Last video is the same as the last saved`
		);
	return lastVideo;
}

/**
 * Get the youtube channel id from an url
 * @param {string} url The URL of the youtube channel
 * @returns The channel ID || null
 */
function getYoutubeChannelIdFromURL(url) {
	let id = null;
	url = url.replace(/(>|<)/gi, '').split(/(\/channel\/|\/user\/)/);
	if (url[2]) {
		id = url[2].split(/[^0-9a-z_-]/i)[0];
	}
	return id;
}

/**
 * Get infos for a youtube channel
 * @param {string} name The name of the youtube channel or an url
 * @returns The channel info || null
 */
async function getYoutubeChannelInfos(name) {
	console.log(
		`[${
			name.length >= 10 ? name.slice(0, 10) + '...' : name
		}] | Resolving channel infos...`
	);
	let channel = null;
	/* Try to search by ID */
	let id = getYoutubeChannelIdFromURL(name);
	if (id) {
		channel = await youtube.getChannelByID(id);
	}
	if (!channel) {
		/* Try to search by name */
		let channels = await youtube.searchChannels(name);
		if (channels.length > 0) {
			channel = channels[0];
		}
	}
	console.log(
		`[${
			name.length >= 10 ? name.slice(0, 10) + '...' : name
		}] | Title of the resolved channel: ${
			channel.raw ? channel.raw.snippet.title : 'err'
		}`
	);
	return channel;
}

/**
 * Check for new videos
 */
async function check() {
	console.log('Checking...');
	config.youtubers.forEach(async youtuber => {
		console.log(
			`[${
				youtuber.length >= 10 ? youtuber.slice(0, 10) + '...' : youtuber
			}] | Start checking...`
		);
		let channelInfos = await getYoutubeChannelInfos(youtuber);
		if (!channelInfos)
			return console.log('[ERR] | Invalid youtuber provided: ' + youtuber);
		let video = await checkVideos(
			channelInfos.raw.snippet.title,
			'https://www.youtube.com/feeds/videos.xml?channel_id=' + channelInfos.id
		);
		if (!video)
			return console.log(
				`[${channelInfos.raw.snippet.title}] | No notification`
			);
		let channel = client.channels.get(config.channel);
		if (!channel) return console.log('[ERR] | Channel not found');
		channel.send(
			config.message
				.replace('{videoURL}', video.link)
				.replace('{videoAuthorName}', video.author)
				.replace('{videoTitle}', video.title)
				.replace('{videoPubDate}', formatDate(new Date(video.pubDate)))
		);
		console.log('Notification sent!');
		lastVideos[channelInfos.raw.snippet.title] = video;
	});
}

//Status
const activities_list = [
	`with ${prefix}help`,
	'with Node.js',
	'with the chill cafe™ server',
	'Shoutout to ---'
]; // arraylist containing phrases

client.on('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * activities_list.length); // generates a random number between 1 and the length of the activities array list
		client.user.setActivity('<activity>', { type: 'WATCHING' });
		client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
	}, 10000); // Runs this every 10 seconds.
});

//Error Catches
client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
process.on('warning', console.warn);

client.login(process.env.TOKEN).then(token => {
	if (token) {
		print('Logged in with token ' + token);
		print('Reading file ' + channelPath);
		var file = fs.readFileSync(channelPath, { encoding: 'utf-8' });
		servers = JSON.parse(file);

		// tick once on startup
		tick();
		setInterval(tick, interval);
	} else {
		print('An error occured while logging in:', err);
		process.exit(1);
	}
});
