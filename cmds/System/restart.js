exports.data = {
	name: 'Restart',
	command: 'restart',
	description: 'Restarts Bot.',
	group: 'System',
	syntax: 'restart',
	author: 'Aris A.',
	permissions: 4
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Restart');
	const exec = require('util').promisify(require('child_process').exec);
	try {
		return new Promise((resolve, reject) => {
			try {
				msg.channel.send('Restarting all processes!');
				exec(`cd ${bot.config.folders.home} && node main.js`);
				bot.destroy();
				process.exit();
			} catch (err) {
				log.error(`Error on bot quit: ${err}`);
				reject(err);
			}
		});
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in stop.js: ${err}`);
	}
};
