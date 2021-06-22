let discord = require("discord.js")
let client = new discord.Client()

let fs = require("fs")
let plugins = {}

function searchPlugins(root) {
    let folder = fs.readdirSync(root)
    folder.forEach(file => {
        let path = root + "\\" + file
        if (fs.lstatSync(path).isDirectory()) searchPlugins(path)
        else if (file.endsWith(".js")) {
            let plugin = require(path)
            plugins[plugin.name] = plugin
            try { plugins[plugin.name].startup(client) }
            catch { return }
        }
    })
}

if (fs.existsSync("./plugins")) searchPlugins("./plugins")
else console.log("No plugins folder!")

client.addListener("ready", () => {
    client.user.setPresence({ activity: { name: "us like a damn fiddle" } })
    console.log("Robonokah online!")
})

client.addListener("message", message => {
    let args = message.content.split(" ")
    let utility = args.shift().replace("^", "")
    if (plugins[utility]) plugins[utility].execute(message, args)
})

client.login("token")