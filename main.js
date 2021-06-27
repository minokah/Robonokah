let discord = require("discord.js")
let client = new discord.Client()

let fs = require("fs")
let plugins = {}

function searchPlugins(root = "./plugins") {
    let folder = fs.readdirSync(root)
    folder.forEach(file => {
        let path = root + "\\" + file
        if (fs.lstatSync(path).isDirectory()) searchPlugins(path)
        else if (file.endsWith(".js")) {
            let plugin = require(path)
            plugins[plugin.name] = plugin
            try { plugins[plugin.name].startup(client) }
            catch { }
        }
    })
}

if (fs.existsSync("./plugins")) searchPlugins()
else console.log("No plugins folder!")

client.addListener("ready", () => {
    client.user.setPresence({ activity: { name: "us like a damn fiddle" } })
    console.log(`Robonokah online! ${Object.keys(plugins).length} plugins loaded`)
})

client.addListener("message", message => {
    try {
        let args = message.content.split(" ")
        let utility = args.shift().replace("^", "")
        if (utility == "reload") {
            if (fs.existsSync("./plugins")) {
                plugins = {}
                searchPlugins()
                message.channel.send(new discord.MessageEmbed({ title: "💫 Reload Plugins", color: "#4cd137", description: `${Object.keys(plugins).length} plugins reloaded!` }))
            }
            else message.channel.send(new discord.MessageEmbed({ title: "💫 Reload Plugins", color: "#ff0000", description: "No plugins folder!" }))
        }
        else if (plugins[utility]) plugins[utility].execute(message, args)
    }
    catch (error) { message.channel.send(new discord.MessageEmbed({ title: "Exception", color: "#ff0000", description: `${utility}! failed to run!` })) }
})

client.login("token")