exports.data = {
	name: 'Update',
	command: 'update',
	description: 'Update tron code.',
	group: 'system',
	syntax: 'update',
	permissions: 4
};

const moment = require('moment');
const config = require('../../config.json');
const auth = require('../../auth.json');
const exec = require("util").promisify(require("child_process").exec);
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Server = require(`${config.folders.lib}/db.js`);

exports.func = async (msg,args,bot) => {
	try {
		const sent = await msg.channel.send("Updating code...");
		const responsed = await exec(`git pull https://${auth.Github.Username}:${auth.Github.Password}@github.com/pamehabai6/Tron.git`);
        if(responsed.stdout.toString("utf8").includes("Already up to date.")){
			return await sent.edit("The code is already up to date!");
		} else {
			await sent.edit(`Code has been updated!\`\`\`\n${responsed.stdout}\n\`\`\``);
		}
        if(responsed.stdout.toString("utf8").includes("package.json")) {
            const senttwo = await msg.channel.send("BUT WAIT, THERE IS MORE... package.json update detected! Launching NPM...");
            const npm = await exec("npm install");
            await senttwo.edit(`New packages and updates have been installed!\`\`\`\n${npm.stdout}\n\`\`\``);
        }
        process.exit();
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};