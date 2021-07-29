let discord = require("discord.js")

let usersLogging = {}

module.exports = {
    name: "fakedfn",
    startup(client) {
        /*
        client.channels.cache.forEach(channel => {
            if (channel.constructor.name == "VoiceChannel") {
                //console.log(channel.name)
                channel.members.forEach(n => {
                    if (!n.channel) usersLogging[n.id] = false // disconnected
                    else if (n.deaf) {
                        usersLogging[n.id] = true

                        setTimeout(() => {
                            if (n.deaf) {
                                n.kick()
                                client.writeConfig("fakedfn", "kicks", this.config.kicks + 1, 1)
                            }
                            usersLogging[n.id] = false
                        }, 3600000)
                    }
                })
            }
        });
        */

        client.on("voiceStateUpdate", (o, n) => {
            if (!n.channel) usersLogging[n.id] = false // disconnected
            else if (n.deaf) {
                usersLogging[n.id] = true

                setTimeout(() => {
                    if (n.deaf) {
                        n.kick()
                        client.writeConfig("fakedfn", "kicks", this.config.kicks + 1, 1)
                    }
                    usersLogging[n.id] = false
                }, 3000000 + (Math.floor(Math.random() * 600000)))
            }
        })
    },
    execute(message) {
        message.channel.send(new discord.MessageEmbed({
            title: "🎧❗ Anti-Deafen",
            description: "Stop deafening and sitting a call please",
            color: "#f9ca24",
            fields: [{ name: "Users Kicked", value: (this.config.kicks != null) ? this.config.kicks : 0 }]
        }))
    }
}