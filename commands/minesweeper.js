module.exports = {
	name: 'minesweeper',
	description: 'Play a game of Minesweeper',
	execute(message, args) {
		argDone = 0;
		msgArg = message.content.substr(prefix.length + 1).split(' ');
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
				message.channel.send(msgToSend);
			}
			message.channel.send(
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
					`${prefix}minesweeper <width(min:4,max:16)> <height(min:4,max:16)> <mine>`
				);
			message.channel.send(msgToSend);
		}

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
	}
};
