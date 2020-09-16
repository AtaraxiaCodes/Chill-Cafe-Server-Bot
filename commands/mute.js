module.exports = {
	name: 'mute',
	description: 'Mute a member of the server',
	execute(message, args) {
		const discord = require('discord.js');
    const { mutedRoleID } = require('./config.json');
  	if(!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"]) || !message.guild.owner) return message.reply("You haven't the permission to use this command!");
  	if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.reply("I don't have permission to manage roles!");
  	let toMute = message.mentions.members.first();
  	if(!toMute) return message.reply("Supply a user to be muted!");
  	let reason = args.slice(1).join(" ");
  	if(!reason) reason = "No reason given";
  	let muteRole = mutedRoleID
  	if(!muteRole) {
	  	message.reply('Muted Role Set');
	  }
	  message.guild.channels.cache.forEach((channel) => {
		  channel.updateOverwrite(muteRole, {
	  		"SEND_MESSAGES": false,
		  	"ATTACH_FILES": false,
			  "SEND_TTS_MESSAGES": false,
	   		"ADD_REACTIONS": false,
		  	"SPEAK": false,
			  "STREAM": false
	  	});
	  });
	  const muteConfirm = new discord.MessageEmbed()
	    .setColor('#0099ff')
	    .setDescription(`✅ ${toMute.user.username} has been successfully muted!\nReason: __${reason}__`);
	  toMute.roles.add(muteRole.id).then(() => {
		  message.delete()
		  toMute.send(`You have been muted in **${message.guild.name}** for: **${reason}**`)
		  message.channel.send(muteConfirm)
	  });
	},
};