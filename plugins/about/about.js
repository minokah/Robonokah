let discord = require("discord.js")

module.exports = {
    name: "about",
    execute(message) {
        message.channel.send(new discord.MessageEmbed({
            title: "Robonokah",
            description: "Playing us like a damn fiddle",
            color: "#03fce8",
            thumbnail: { url: "https://i.imgur.com/osYUUmY.png" },
            url: "https://github.com/minokah/Robonokah",
            fields: [{ name: "Hello there!", value: "minokah#4032" }]
        }))
    }
}