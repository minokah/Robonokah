let discord = require("discord.js")

let usersLogging = {}
let punishCount = 0

module.exports = {
    name: "fakedfn",
    startup(client) {
        client.on("voiceStateUpdate", (o, n) => {
            if (!n.channel) usersLogging[n.id] = false // disconnected
            else if (n.deaf) {
                usersLogging[n.id] = true

                setTimeout(() => {
                    n.kick()
                    punishCount += 1
                    usersLogging[n.id] = false
                }, 3600000)
            }
        })
    },
    execute(message) {
        message.channel.send(new discord.MessageEmbed({
            title: "🎧❗ Anti-Deafen",
            description: "Stop deafening and sitting a call please",
            color: "#f9ca24",
            fields: [{ name: "Users Punished", value: punishCount }]
        }))
    }
}