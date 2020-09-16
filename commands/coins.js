const discord = require('discord.js');
let coins = require('../coins.json');
module.exports = {
	name: 'coins',
	description: 'Displays the amount of coins you or a specified member have',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		if (!coins[message.author.id]) {
			coins[message.author.id] = {
				coins: 0
			};
		}
		let userCoins = coins[message.author.id].coins;
		let argsUser =
			message.guild.member(message.mentions.users.first()) ||
			message.guild.members.get(args[0]);
		if (argsUser) {
			if (!coins[argsUser.id]) {
				coins[argsUser.id] = {
					coins: 0
				};
			}
			let coinEmbed = new discord.MessageEmbed()
				.setAuthor(argsUser.user.username)
				.setColor('#ffffff')
				.addField(':moneybag:', coins[argsUser.id].coins);
			return message.channel.send(coinEmbed).then(msg => {
				msg.delete(5000);
			});
		}
		let coinEmbed = new discord.MessageEmbed()
			.setAuthor(message.author.username)
			.setColor('#ffffff')
			.addField(':moneybag:', userCoins);
		message.channel.send(coinEmbed).then(msg => {
			msg.delete(5000);
		});
	}
};
