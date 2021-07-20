let discord = require("discord.js")

let connection = null

module.exports = {
    name: "voice",
    execute(message, args) {
        if (args.length > 0) {
        let command = args.shift()
            try {
                switch (command) {
                    case "join": {
                        if (message.member.voice.channel) {
                            connection = message.member.voice.channel.join()
                            message.channel.send(new discord.MessageEmbed({
                                title: `🎧 ${message.member.voice.channel.name}`,
                                description: "Joined voice channel!",
                                color: "#03fce8",
                                footer: { text: message.member.user.tag, iconURL: message.member.user.avatarURL() },
                            }))
                        }
                        else throw "You are not in a voice channel!"

                        break
                    }
                }
            }
            catch (error) {
                message.channel.send(new discord.MessageEmbed({ title: "🎧 Voice", color: "#ff0000", description: error.message != null ? error.message : error }))
            }
        }
        else message.channel.send(new discord.MessageEmbed({
            title: "🎧 Voice",
            description: "Make me play music or whatever you desire",
            color: "#03fce8",
            //thumbnail: { url: "https://www.clipartkey.com/mpngs/m/59-594682_final-fantasy-xiv-ffxiv-dark-knight-logo.png" },
            fields: [
                {
                    name: "Commands",
                    value: "None"
                }
            ]
        }))
    }
}