const db = require('quick.db');

class LevelUtil {
	static getLevel(xp, extra = false) {
		let level = 0;

		//WHILE LOOP
		while (xp >= LevelUtil.getLevelxp(level)) {
			xp -= LevelUtil.getLevelxp(level);
			level++;
		}
		if (extra) return [level, xp];
		else return level;
	}

	static getLevelxp(level) {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	static getInfo(exp) {
		let [level, remxp] = LevelUtil.getLevel(exp, true);
		let levelxp = LevelUtil.getLevelxp(level);

		return { level, remxp, levelxp };
	}

	static addexp(message) {
		let toadd = Math.floor(Math.random() * 3 + 3);
		let oldxp = db.get(`xp_${message.author.id}_${message.guild.id}`);
		let oldlvl = LevelUtil.getLevel(oldxp);
		let newxp = (oldxp = toadd);
		let newlvl = LevelUtil.getLevel(newxp);
		let elderRole = message.guild.roles.cache.find(
			role => role.id == '734189094271320195'
		);
		let legendRole = message.guild.roles.cache.find(
			role => role.id == '734189143965564939'
		);
		let veteranRole = message.guild.roles.cache.find(
			role => role.id == '734188797960388628'
		);

		if (newlvl > oldlvl) {
			message.channel.send(
				`${message.author}, You just reached level ${newlvl}`
			);
		}

		if (newlvl == 5) {
			message.channel.send(`${message.author}, You ranked up!`);
			message.member.role.add(elderRole);
		}

		if (newlvl == 10) {
			message.channel.send(`${message.author}, You ranked up!`);
			message.member.role.add(legendRole);
		}

		if (newlvl == 15) {
			message.channel.send(`${message.author}, You ranked up!`);
			message.member.role.add(veteranRole);
		}

		db.add(`xp_${message.author.id}_${message.guild.id}`, toadd);
	}
}

module.exports = LevelUtil;
