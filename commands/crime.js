const discord = require('discord.js');
let coins = require('../coins.json');
const fs = require('fs');
const crimeRecently = new Set();
var robbedArray = ['Corner Store', 'Car Wash', 'School'];

module.exports = {
	name: 'crime',
	description: 'Commit a crime',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		function getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max));
		}
		if (crimeRecently.has(message.author.id)) {
			message.channel.send(
				'You can only do this once every 30 minutes. - ' +
					message.author.username
			);
		} else {
			crimeRecently.add(message.author.id);
			setTimeout(() => {
				crimeRecently.delete(message.author.id);
			}, 1800000); //1800000 = 30 mins
			robbed = getRandomInt(robbedArray.length);
			if (getRandomInt(2) == 1) {
				coinsGained = getRandomInt(1500);
				coins[message.author.id].coins = Math.round(
					coins[message.author.id].coins + coinsGained
				);
				crimeEmbed = new discord.MessageEmbed()
					.setAuthor(message.author.username)
					.setColor('#00ff00')
					.addField(
						':gun:',
						'You robbed a ' +
							robbedArray[robbed] +
							' and got ' +
							coinsGained +
							'coins!'
					)
					.addField('Chance', '1/2');
				message.channel.send(crimeEmbed).then(msg => {
					msg.delete(6000);
				});
			} else {
				coinsLost = Math.round(coins[message.author.id].coins / 10);
				coins[message.author.id].coins = Math.round(
					coins[message.author.id].coins - coinsLost
				);
				caughtEmbed = new discord.MessageEmbed()
					.setAuthor(message.author.username)
					.setColor('#ff0000')
					.addField(
						':gun:',
						'You were robbing a ' +
							robbedArray[robbed] +
							' and got caught by the police and you lose 10% (' +
							coinsLost +
							') of your coins!'
					)
					.addField('Chance', '1/2');
				message.channel.send(caughtEmbed).then(msg => {
					msg.delete(5000);
				});
			}
		}
	}
};
