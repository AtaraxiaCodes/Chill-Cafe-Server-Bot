const discord = require('discord.js');

const canvas = require('canvas');

const ytdl = require('ytdl-core');
const queue = new Map();

const client = new discord.Client();

const fs = require('fs');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.end();
});

app.listen(8080);

client.on('ready', () => {
  console.log('Bot Running!');
});

//prefix
const prefix = '%';

//Help Embed
const helpEmbed = new discord.MessageEmbed()
      .setTitle('Help Documentation')
      .setAuthor("Server Bot", "https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342")
      .setColor('#00ffff')
      .setDescription('chill cafe™')
      .setThumbnail("https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342")
      .addFields(
        { name: `${prefix}ping`, value: 'Test Ping' },
        { name: `${prefix}server`, value: 'Displays Server Name' },
        { name: `${prefix}member`, value: 'Displays Member Count' },
        { name: `${prefix}created`, value: 'Displays Creation Date' },
        { name: `${prefix}help`, value: 'DMs Help Documentation' },
        { name: `${prefix}profile`, value: 'Displays Rank and Level Data (WIP)' },
        { name: `${prefix}rickroll`, value: 'Plays the Rickroll in VC' },
        );
        
//Profile Embed
const profileEmbed = new discord.MessageEmbed()
      .setTitle('Your Profile')
      .setAuthor("Server Bot", "https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342")
      .setColor('#00ffff')
      .setDescription('chill cafe™')
      .setThumbnail("https://cdna.artstation.com/p/assets/images/images/009/476/384/large/paradox-beatbox-logo-emblem.jpg?1519215342")
      .addFields(
        { name: 'Current Rank', value: 'Coming Soon' },
        { name: 'Current  Level', value: 'Coming Soon' },
        { name: 'EXP to next Level', value: 'Coming Soon' },
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
		let levelUp = (user.level * levelrate) - user.xp

		if (user.xp >= levelrate * user.level) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You leveled up! You are now level ${++user.level}`
			);
			user.xp = 0;
			console.log(`${msg.author.id} Leveled Up`);
		}

		if (user.level == 5) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189094271320195>`
			);
			msg.member.role.add(elderRole);
			console.log(`${msg.author.id} Ranked Up`);
		}

		if (user.level == 10) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189143965564939>`
			);
			msg.member.role.add(legendRole);
			console.log(`${msg.author.id} Ranked Up`);
		}

		if (user.level == 15) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734188797960388628>`
			);
			msg.member.role.add(veteranRole);
			console.log(`${msg.author.id} Ranked Up`);
		}

		updateUser(msg.author.id, user);
	} else {
		updateUser(msg.author.id, { xp: 0, level: 1 });
	}

	//Welcome Message
client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === '⌇😎⌇-public-chat');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}`);
  console.log('Member Joined')
});

//Welcome Message w/ canvas
client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === '⌇😎⌇-public-chat');
	if (!channel) return;

	const canvas = canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await canvas.loadImage('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/735e5caa-855e-4c0d-8d02-9f8946e87f0b/dc0p8v9-d57bd85c-ae41-4d4e-bad6-2d81c71ba3c8.png/v1/fill/w_1096,h_729,strp/_c__the_library_cafe_by_malthuswolf_dc0p8v9-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD04NTEiLCJwYXRoIjoiXC9mXC83MzVlNWNhYS04NTVlLTRjMGQtOGQwMi05Zjg5NDZlODdmMGJcL2RjMHA4djktZDU3YmQ4NWMtYWU0MS00ZDRlLWJhZDYtMmQ4MWM3MWJhM2M4LnBuZyIsIndpZHRoIjoiPD0xMjgwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.z6JBFocchK7qkHrCiDDxnKhktaRqlpbxkYNrZyWbS6A');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#00FFFF';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});

	//General Text Commands
	if (msg.content == `${prefix}ping`) {
		msg.channel.send('Pong!'); //Ping for test
	} else if (msg.content == `${prefix}server`) {
		msg.channel.send(`This server's name is: ${msg.guild.name}`); //Server Name
	} else if (msg.content == `${prefix}member`) {
		msg.channel.send(`Total members: ${msg.guild.memberCount}`); //Member Count
	} else if (msg.content == `${prefix}created`) {
		msg.channel.send(`Created On ${msg.guild.createdAt}`); //Creation Date
	} else if (msg.content == `${prefix}help`) {
		message.author.send(helpEmbed); //DM Help Embed
		console.log('Help Sent');
  } else if (msg.content == `${prefix}profile`) {
    message.channel.send(profileEmbed); //Send Profile Embed
    console.log('Profile Displayed');
  }
});

//Play Youtube Music
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

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
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
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
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

//Play The Rickroll From Youtube
client.on('message', async message => {
	if (message.content === `${prefix}rickroll`) {
		if (message.channel.type === 'dm') return;

		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.reply('Please join a voice channel first!');
		}

		voiceChannel.join().then(connection => {
			const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter: 'audioonly' });
			const dispatcher = connection.play(stream);
      console.log('Rickrolled!')
      
			dispatcher.on('finish', () => voiceChannel.leave());
		});
	}
});

//Kick Members Command
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

//Ban Members Command
client.on('message', message => {
  if (!message.guild) return;
if (message.content.startsWith(`${prefix}ban`)) {
  const user = message.mentions.users.first();
  if (user) {
    const member = message.guild.member(user);
    if (member) {
      member
        .ban({
          reason: 'They were naughty!',
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

const activities_list = [
	`with the ${prefix}rickroll`,
	'with Node.js',
	'with the chill cafe™ server',
	'Shoutout to ---'
]; // arraylist containing phrases

client.on('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * activities_list.length); // generates a random number between 1 and the length of the activities array list
		client.user.setActivity('<activity>', { type: 'WATCHING' });
		client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
		console.log(`Status Changed to "${activities_list[index]}" (${index})`)
	}, 10000); // Runs this every 10 seconds.
});

client.login(process.env.TOKEN);