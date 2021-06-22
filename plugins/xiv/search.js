let discord = require("discord.js")
let http = require("http")

module.exports = {
    name: "xiv",
    execute(message, args) {
        if (args.length > 0) {
            let command = args.shift()
            try {
                switch (command) {
                    case "ad":
                        message.channel.send(new discord.MessageEmbed({
                            title: "✨ Have you heard of Final Fantasy XIV?",
                            description: "...you know, the critically acclaimed MMORPG by Square Enix which includes has a free trial, the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60?",
                            color: "#03fce8",
                            url: "https://freetrial.finalfantasyxiv.com/gb/",
                            fields: [
                                { name: "No...?", value: "Well now you have! And you should play it!" },
                                { name: "Why should I?", value: "Because you probably don't have anything better to do with your time, now do ya?" }
                            ]
                        }))
                        break
                    case "map":
                        if (args.length == 0) message.channel.send("❌ 🗺️ You must specify a location (ex. La Noscea/Lower La Noscea)")
                        else {
                            let location = args.join(" ")
                            let url = location.replace(/\s/g, "%20")
                            message.channel.send(new discord.MessageEmbed({
                                title: "🗺️ " + location.replace(/\//g, " > "),
                                color: "#03fce8",
                                image: { url: "https://www.garlandtools.org/files/maps/" + url + ".png" },
                                footer: { text: "No image? Your input may not be a real location" }
                            }))
                        }
                        break
                }
            }
            catch (error) { message.channel.send("❌ " + error) }
        }
        else message.channel.send(new discord.MessageEmbed({
            title: "☄️ Search Final Fantasy XIV",
            description: "Search for things from the critically acclaimed MMORPG",
            color: "#03fce8",
            thumbnail: { url: "https://www.clipartkey.com/mpngs/m/59-594682_final-fantasy-xiv-ffxiv-dark-knight-logo.png" },
            fields: [
                {
                    name: "Commands",
                    value: "🗺️ **map** (location) - Bring up a map of a specified location (ex. La Noscea/Lower La Noscea)" +
                        "\n📰 **ad** - Have you tried the critically-acclaimed..."
                }
            ]
        }))
    }
}