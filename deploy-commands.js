const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

function searchCommands(root = "./commands") {
	let folder = fs.readdirSync(root)
	folder.forEach(file => {
		let path = root + "\\" + file
		if (fs.lstatSync(path).isDirectory()) searchCommands(path)
		else if (file.endsWith(".js")) {
			let command = require(path)
			if (command.data != null) commands.push(command.data.toJSON())
		}
	})
}

searchCommands()

const rest = new REST({ version: '9' }).setToken("token")

rest.put(Routes.applicationGuildCommands("client", "guild"), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)