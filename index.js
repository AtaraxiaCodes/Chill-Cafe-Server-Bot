const discord = require('discord.js');

const client = new discord.Client();

const fs = require('fs');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.end();
});

app.listen(8080);

//prefix
const prefix = '%';

//Help Embed
const helpEmbed = new discord.MessageEmbed()
      .setTitle('Help Documentation')
      .setColor('#00ffff')
      .setDescription('chill cafe™')
      .addFields(
        { name: `${prefix}ping`, value: 'Test Ping' },
        { name: `${prefix}server`, value: 'Displays Server Name' },
        { name: `${prefix}member`, value: 'Displays Member Count' },
        { name: `${prefix}created`, value: 'Displays Creation Date' },
        { name: `${prefix}help`, value: 'DMs Help Documentation' },
        { name: `${prefix}profile`, value: 'Displays Rank and Level Data (WIP)' },
        );
        
//Profile Embed
const profileEmbed = new discord.MessageEmbed()
      .setTitle('Help Documentation')
      .setColor('#00ffff')
      .setDescription('chill cafe™')
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

		if (user.xp >= levelrate * user.level) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You leveled up! You are now level ${++user.level}`
			);
			user.xp = 0;
		}

		if (user.level == 5) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189094271320195>`
			);
			msg.member.roles.add(elderRole);
		}

		if (user.level == 10) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734189143965564939>`
			);
			msg.member.roles.add(legendRole);
		}

		if (user.level == 15) {
			msg.channel.send(
				`Congratulations, <@${
					msg.author.id
				}>. You ranked up! You are now <@&734188797960388628>`
			);
			msg.member.roles.add(veteranRole);
		}

		updateUser(msg.author.id, user);
	} else {
		updateUser(msg.author.id, { xp: 0, level: 1 });
	}

	//Welcome Message (unstable)
	client. on('guildMemberAdd', member => {
		const channel = member.guild.channels.cache.find(
			ch => ch.name === '⌇😎⌇-public-chat'
		);

		if (!channel) return;

		channel.send(`Welcome to the server, ${member}`);
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
  } else if (msg.content == `${prefix}profile`) {
    message.channel.send(profileEmbed); //Send Profile Embed
  }
});


const activities_list = [
	'with the %help command.',
	'with Node.js',
	'with the chill cafe™ server',
	'Shoutout to Star Trek'
]; // arraylist containing phrases

client.on('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * activities_list.length); // generates a random number between 1 and the length of the activities array list
		client.user.setActivity('<activity>', { type: 'WATCHING' });
		client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
	}, 10000); // Runs this every 10 seconds.
});

client.login(process.env.TOKEN);