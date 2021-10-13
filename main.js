const fs = require('fs');
const { Client, Collection, Intents, ClientUser } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.commands = new Collection();

function searchCommands(root = "./commands") {
	let folder = fs.readdirSync(root)
	folder.forEach(file => {
		let path = root + "\\" + file
		if (fs.lstatSync(path).isDirectory()) searchCommands(path)
		else if (file.endsWith(".js")) {
			let command = require(path)
			if (command.data != null) client.commands.set(command.data.name, command)
		}
	})
}

searchCommands()

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login("token");