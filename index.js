const discord = require('discord.js');
const client = new discord.Client();

//Configuration Files
const {
	prefix,
	token,
	id,
	clientSecret,
	domain,
	port,
	message,
	channel,
	youtubers,
	YOUTUBE_API_KEY,
	SOUNDCLOUD_CLIENT_ID,
	twitchClientId,
	mongodbUrl,
	infectionRoleID,
	moderatorRoleID,
	mutedRoleID
} = require('./config.json');

//Escape Regex
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//Dependencies
const canvas = require('canvas'),
	ytdl = require('ytdl-core'),
	queue = new Map(),
	https = require('https'),
	fs = require('fs'),
	express = require('express'),
	app = express(),
	Parser = require('rss-parser'),
	parser = new Parser(),
	Youtube = require('simple-youtube-api'),
	youtube = new Youtube(YOUTUBE_API_KEY),
	mongoose = require('mongoose');

//Dashboard
const GuildSettings = require('./util/MongoUtil');
const Dashboard = require('./dashboard/dashboard');

client.on('message', async message => {
	const reply = (...arguments) => message.channel.send(...arguments);

	if (message.author.bot) return;
	if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
		return;

	var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
	if (!storedSettings) {
		const newSettings = new GuildSettings({
			gid: message.guild.id
		});
		await newSettings.save().catch(() => {});
		storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
	}

	if (message.content.indexOf(storedSettings.prefix) !== 0) return;

	const args = message.content
		.slice(storedSettings.prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		const roundtripMessage = await reply('Pong!');
		return roundtripMessage.edit(
			`*${roundtripMessage.createdTimestamp - message.createdTimestamp}ms*`
		);
	}
});

//MongoDB Connection
mongoose
	.connect(
		mongodbUrl,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.catch(error => handleError(error));
mongoose.connection.on('error', function(e) {
	console.log('Mongoose: Can not connect Error: ' + e);
	var { client } = new discord.Client({ disableEveryone: true });
	client.commands = new discord.Collection();
	process.exit();
});
mongoose.connection.once('open', function(d) {
	console.log(
		'\x1b[34mMongoose:\x1b[0m connected to \x1b[33m' +
			mongoose.connection.host +
			' \x1b[0m'
	);
	console.log('---');
});

//Chat Exp & Leveling/Ranking
const { addexp } = require('./util/LevelUtil');

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;

	return addexp(message);
});

//Rank up and Level Up Messages
client.on('message', message => {
	if (message.author.client) return;
	if (message.channel.type === 'dm') return;

	if (userExists(message.author.id)) {
		let user = getUser(message.author.id);
		let elderRole = message.guild.roles.cache.find(
			role => role.id == '734189094271320195'
		);
		let legendRole = message.guild.roles.cache.find(
			role => role.id == '734189143965564939'
		);
		let veteranRole = message.guild.roles.cache.find(
			role => role.id == '734188797960388628'
		);

		user.xp += msgxp;
		let levelUp = user.level * levelrate - user.xp;

		if (user.xp >= levelrate * user.level) {
			message.channel.send(
				`Congratulations, <@${
					message.author.id
				}>. You leveled up! You are now level ${++user.level}`
			);
			user.xp = 0;
			console.log('\x1b[32m%s\x1b[0m', `${message.author.username} Leveled Up`);
		}

		if (user.level == 5) {
			message.channel.send(
				`Congratulations, <@${
					message.author.id
				}>. You ranked up! You are now <@&734189094271320195>`
			);
			message.member.role.add(elderRole);
			console.log('\x1b[32m%s\x1b[0m', `${message.author.username} Ranked Up`);
		}

		if (user.level == 10) {
			message.channel.send(
				`Congratulations, <@${
					message.author.id
				}>. You ranked up! You are now <@&734189143965564939>`
			);
			message.member.role.add(legendRole);
			console.log('\x1b[32m%s\x1b[0m', `${message.author.username} Ranked Up`);
		}

		if (user.level == 15) {
			message.channel.send(
				`Congratulations, <@${
					message.author.id
				}>. You ranked up! You are now <@&734188797960388628>`
			);
			message.member.role.add(veteranRole);
			console.log('\x1b[32m%s\x1b[0m', `${message.author.username} Ranked Up`);
		}

		updateUser(message.author.id, user);
	} else {
		updateUser(message.displayName, { xp: 0, level: 1 });
	}
});

//Welcome Message w/ canvas
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
	console.log('\x1b[32m%s\x1b[0m', `Welcome message sent to ${member}`);
});

//Dynamic Command Handler
client.commands = new discord.Collection();
const cooldowns = new discord.Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const prefixRegex = new RegExp(
		`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
	);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			cmd => cmd.aliases && cmd.aliases.includes(commandName)
		);

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!");
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
				command.usage
			}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`Please wait ${timeLeft.toFixed(
					1
				)} more second(s) before reusing the \`${command.name}\` command.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Oops, there was a problem executing that command!');
		message.reply(
			'If you feel like an error has occured, tell us at https://forms.gle/YNKWgAK5FP9u5eEz7'
		);
	}
});

//(UNTESTED) Infection Game
async function getInfectedFunction(message) {
	let author = message.author.id;
	let member = message.mentions.users.first();
	if (!member) return;
	let infection = config.infectionRoleID;
	if (message.guild.members.cache.get(author).roles.cache.get(infection))
		return;
	if (message.guild.members.cache.get(member.id).roles.cache.get(infection)) {
		let chance = Math.random() * 100;
		if (chance <= 100) {
			await message.guild.members.cache.get(author).roles.add(infection);
			message.channel.send(`<@${author}> has been infected!`);
			console.log('\x1b[32m%s\x1b[0m', `${author} has been infected!`);
		}
	}
}

async function giveInfectionFunction(message) {
	let pingee = message.mentions.users.first();
	if (!pingee) return;
	let infection = infectionRoleID;
	if (message.guild.members.cache.get(pingee.id).roles.cache.get(infection))
		return;
	if (message.member.roles.cache.get(infection)) {
		let chance = Math.random() * 100;
		if (chance <= 100) {
			await message.guild.members.cache.get(pingee.id).roles.add(infection);
			message.channel.send(
				`<@${pingee.id}> has been infected by <@${message.author.id}>!`
			);
			console.log(
				'\x1b[32m%s\x1b[0m',
				`${pingee.id} has been infected by ${message.author.id}!`
			);
		}
	}
}

client.on('message', message => {
	if (message.channel.type === 'dm') return;
	if (message.author.type === 'bot') return;
	giveInfectionFunction(message);
	getInfectedFunction(message);
});

//(WIP) Twitch Stream Messages - https://github.com/etacarinaea/discord-twitch-bot
const args = process.argv.slice(2),
	channelPath = __dirname + '/.channels',
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
		console.log(
			'\x1b[35mTwitch:\x1b[0m',
			'Saving channels to ' + channelPath + ' before exiting'
		);
		console.log('\x1b[35mTwitch:\x1b[0m', JSON.stringify(servers));
		fs.writeFileSync(channelPath, JSON.stringify(servers, null, 4));
		console.log('\x1b[35mTwitch:\x1b[0m', 'Done');
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
						.then(console.log('\x1b[35mTwitch:\x1b[0m', "Sent embed to channel '" + channels[i].name + "'."));
				}
				twitchChannel.online = true;
				twitchChannel.timestamp = Date.now();
			} else if (defaultChannel) {
				defaultChannel
					.sendEmbed(twitchEmbed)
					.then(console.log('\x1b[35mTwitch:\x1b[0m', "Sent embed to channel '" + defaultChannel.name + "'."));
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
			console.log('\x1b[35mTwitch:\x1b[0m', server.role + ' is not a role on the server', err);
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
	console.log(
		'\x1b[31m%s\x1b[0m',
		`[${youtubeChannelName}]  | Getting videos...`
	);
	let content = await parser.parseURL(rssURL);
	console.log(
		'\x1b[31m%s\x1b[0m',
		`[${youtubeChannelName}]  | ${content.items.length} videos found`
	);
	let tLastVideos = content.items.sort((a, b) => {
		let aPubDate = new Date(a.pubDate || 0).getTime();
		let bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	console.log(
		'\x1b[31m%s\x1b[0m',
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
	console.log(
		'\x1b[31m%s\x1b[0m',
		`[${youtubeChannelName}] | Get the last video..`
	);
	let lastVideo = await getLastVideo(youtubeChannelName, rssURL);
	// If there isn't any video in the youtube channel, return
	if (!lastVideo) return console.log('[ERR] | No video found for ' + lastVideo);
	// If the date of the last uploaded video is older than the date of the bot starts, return
	if (new Date(lastVideo.pubDate).getTime() < startAt)
		return console.log(
			'\x1b[31m%s\x1b[0m',
			`[${youtubeChannelName}] | Last video was uploaded before the bot starts`
		);
	let lastSavedVideo = lastVideos[youtubeChannelName];
	// If the last video is the same as the last saved, return
	if (lastSavedVideo && lastSavedVideo.id === lastVideo.id)
		return console.log(
			'\x1b[31m%s\x1b[0m',
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
		'\x1b[31m%s\x1b[0m',
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
		'\x1b[31m%s\x1b[0m',
		`[${
			name.length >= 10 ? name.slice(0, 10) + '...' : name
		}] | Title of the resolved channel: ${
			channel.raw ? channel.raw.snippet.title : 'err'
		}`
	);
	return channel;
}

//Check For A New Video
async function check() {
	console.log('\x1b[31m%s\x1b[0m', 'Checking...');
	youtubers.forEach(async youtuber => {
		console.log(
			'\x1b[31m%s\x1b[0m',
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
		console.log('\x1b[31m%s\x1b[0m', 'Notification sent!');
		lastVideos[channelInfos.raw.snippet.title] = video;
	});
}

//Bot Status
const activities_list = [
	`with ${prefix}help`,
	'with Node.js',
	'with the chill cafe™ server',
	'Shoutout to ---'
]; // arraylist containing phrases

client.on('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * activities_list.length); // generates a random number between 1 and the length of the activities array list
		client.user.setActivity('<activity>', { type: 'PLAYING' });
		client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
	}, 10000); // Runs this every 10 seconds.
});

//Login
client.login(token).then(token => {
	if (token) {
		console.log(
			'\x1b[34mDiscord:\x1b[0m Logged in with token',
			'\x1b[33m' + token,
			'\x1b[0m'
		);
		console.log('\x1b[35mTwitch:\x1b[0m Reading file ' + channelPath);
		var file = fs.readFileSync(channelPath, { encoding: 'utf-8' });
		servers = JSON.parse(file);
		console.log('---');
		console.log('\x1b[36m%s\x1b[0m', `${client.user.username} Running!`);
		console.log(
			'\x1b[36m%s\x1b[0m',
			`${client.guilds.cache.size} Guilds | ${
				client.channels.cache.size
			} Channels | ${client.users.cache.size} Users`
		);
		console.log('\x1b[36m%s\x1b[0m', 'Prefix: ' + prefix);
		console.log(
			'\x1b[36m%s\x1b[0m',
			'Bot Issue Form: https://forms.gle/YNKWgAK5FP9u5eEz7'
		);
		console.log('---');

		// tick once on startup
		tick();
		setInterval(tick, interval);

		//Dashboard
		Dashboard(client);
	} else {
		console.log(
			'\x1b[34mDiscord:\x1b[0m An error occured while logging in:',
			err
		);
		process.exit(1);
	}
});
