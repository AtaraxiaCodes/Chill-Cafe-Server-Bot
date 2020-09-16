const discord = require("discord.js")
let coins = require("../coins.json")
module.exports = {
  name: 'rob',
	description: 'Rob a specified member',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    let argsUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(message.author.id == argsUser.id) {
        robSelfEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("ff0000")
        .addField(`:x:You can't rob yourself!`,":x:You idiot...")
        return message.channel.send(robSelfEmbed)
    }
    if (argsUser) {
        if(!coins[argsUser.id]){
            coins[argsUser.id] = {
                coins:0
            };
        }
    } else {
        message.channel.send("Specify a user")
    }
    if (getRandomInt(2) == 1) {
        let userCoins = coins[message.author.id].coins;
        let victimCoins = coins[argsUser.id].coins;
        let two_perc = Math.round(victimCoins / 50);
        coins[argsUser.id].coins = coins[argsUser.id].coins - two_perc;
        coins[message.author.id].coins = Math.round(coins[message.author.id].coins + two_perc)
        robbedEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("#00ff00")
        .addField(":gun:","You robbed " + argsUser.user.username + " For 2% of their coins! ("+two_perc+")")
        .addField("Chance","1/2")
        message.channel.send(robbedEmbed).then(msg => {msg.delete(5000)});
    } else {
        coinsLost = Math.round(coins[message.author.id].coins / 50)
        coins[message.author.id].coins = coins[message.author.id].coins - coinsLost
        caughtEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("#ff0000")
        .addField(":gun:","You were robbing " + argsUser.user.username + " and got caught by the police and you lose 2% ("+coinsLost+") of your coins!")
        .addField("Chance","1/2")
        message.channel.send(caughtEmbed).then(msg => {msg.delete(5000)});
    }
  }
}