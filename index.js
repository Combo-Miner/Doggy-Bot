const { Client, Collection } = require("discord.js");
const config = require('./config.json')

const client = new Client({
	partials : ["MESSAGE","GUILD_MEMBER","CHANNEL","USER","GUILD_SCHEDULED_EVENT","REACTION"],
    intents: 32767,
});

client.setMaxListeners(0)
module.exports = client;


client.slashCommands = new Collection();
client.commands = new Collection();
client.config = config







             

// Handlers
require("./handlers")(client);
require('./handlers/anti-crash')(client);

client.login(client.config.token);


