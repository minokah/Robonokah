let discord = require("discord.js")
let client = new discord.Client()

let fs = require("fs")
let plugins = {}
let config = {}
let configName = "./config.json"

client.writeConfig = function (plugin, property, value, def = null) {
    if (config[plugin] == null) config[plugin] = {}
    
    if (config[plugin][property] == null && def != null) {
        config[plugin][property] = def
        plugins[plugin].config[property] = def
        console.log(`${plugin}: ${property} = ${def}`)
    }
    else if (value != null) {
        console.log(`${plugin}: ${property} = ${config[plugin][property]} -> ${value}`)
        plugins[plugin].config[property] = value
        config[plugin][property] = value
    }

    fs.writeFileSync(configName, JSON.stringify(config))
}

function searchPlugins(root = "./plugins") {
    let folder = fs.readdirSync(root)
    folder.forEach(file => {
        let path = root + "\\" + file
        if (fs.lstatSync(path).isDirectory()) searchPlugins(path)
        else if (file.endsWith(".js")) {
            let plugin = require(path)
            plugins[plugin.name] = plugin

            if (config[plugin.name] != null) plugin.config = config[plugin.name]
            else plugin.config = {}

            try { plugins[plugin.name].startup(client) }
            catch { }
        }
    })
}

if (fs.existsSync("./config.json")) {
    try {
        config = require("./config.json")
        console.log("Config file read")
    }
    catch (error) {
        configName = "./config2.json"
        console.log(`Couldn't read config file! Saving new configurations to config2.json. Merge configs after fixing!`)
    }
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

                Object.keys(require.cache).forEach(key => {
                    if (key.startsWith(__dirname + "\\plugins")) delete require.cache[key]
                });

                plugins = {}

                searchPlugins()
                message.channel.send(new discord.MessageEmbed({ title: "💫 Reload Plugins", color: "#4cd137", description: `${Object.keys(plugins).length} plugins reloaded!` }))
            }
            else message.channel.send(new discord.MessageEmbed({ title: "💫 Reload Plugins", color: "#ff0000", description: "No plugins folder!" }))
        }
        else if (plugins[utility]) plugins[utility].execute(message, args)
    }
    catch (error) { message.channel.send(new discord.MessageEmbed({ title: "Exception", color: "#ff0000", description: error.message })) }
})

client.login("token")