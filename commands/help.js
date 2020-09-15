module.exports = {
	name: 'help',
	description: 'DMs Help Documentation',
	cooldown: 5,
	execute(message, args) {
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
	    	{ name: `${prefix}truthordare`, value: 'Play a Truth or Dare Game' },
	    	{ name: `${prefix}minesweeper`, value: 'Play a Minesweeper Game' }
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

		message.author.send(helpEmbed1); //DM Server Stat Help Embed
    message.author.send(helpEmbed2); //DM Fun Help Embed
    message.author.send(helpEmbed3); //DM Music Help Embed
    message.author.send(helpEmbed4); //DM Stream Notification Help Embed
    console.log(`Help command used by ${message.author.username}`);
	},
};