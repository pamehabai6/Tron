exports.func = async (bot) => {
    try {
        const OTS = require(`${bot.config.folders.models}/mute.js`);
        const loadCommands = require(`${bot.config.folders.lib}/loadCommands.js`);
        const loadWatchers = require(`${bot.config.folders.lib}/loadWatchers.js`);
        const log = require(`${bot.config.folders.lib}/log.js`)('Core');
        log.info(chalk.green(`Connected to Discord gateway & ${bot.guilds.size} guilds.`));
        

        [bot.commands, bot.watchers] = await Promise.all([loadCommands.func(bot, log), loadWatchers.func(bot, log)]); // Load commands and watchers in parallel
        // Loop through connected guilds
		bot.guilds.keyArray().forEach(async id => {
            // Get guild object
            const guild = bot.guilds.get(id);
            // Create server table if it does not exist
            await bot.Server.sync();
            // Attempt to find server with ID
			const server = await bot.Server.findOne({ 
				where: {
					guildId: id
				}
            });
            // If server is not known
            if (!server) { 
                // Create a server object
				const server = await bot.Server.create({ 
					guildId: id,
					name: guild.name,
					permitChan: [],
					perm3: [],
					perm2: [],
					perm1: []
				});
				// Emit a warning
				log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			} else if (server.perm1 == "" || server.perm2 == "" || server.perm3 == "") {
                log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
            }
            // Set up Muted roles
			const OTSroles = await OTS.findOne({
				where: {
					guildId: id
				}
			});
			if (!OTSroles){
				//Creates OTS entry
				await OTS.create({
					guildId: id,
                    roleId: [],
                    mutedChannelId: [],
                    botspamChannelId: []
				});
				log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
            } else if (OTSroles.roleId == "" || OTSroles.mutedChannelId == "" || OTSroles.botspamChannelId == "") {
                log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
            }
			await bot.createCommands(guild, id);
		});
	} catch (err) {
		log.error(`Error in bot initialisation: ${err}`);
	}
}