let https = require("https")
let discord = require("discord.js")

module.exports = {
    name: "math",
    execute(message, args) {
        let command = args.shift()

        if (command != null) {
            try {
                switch (command) {
                    default: {
                        let input = new String(command)
                        command = command.replace(/\+/g, "%2B")
                        https.get(`https://api.mathjs.org/v4/?expr=${command}`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                message.channel.send(new discord.MessageEmbed({
                                    title: `🔎 ${input}`,
                                    description: recieved,
                                    color: "#f6e58d"
                                }))
                            })
                        })
                    }
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        else message.channel.send(new discord.MessageEmbed({
            title: "🧮 Math",
            description: "Do math operations",
            color: "#f6e58d",
            //thumbnail: { url: "https://www.clipartkey.com/mpngs/m/59-594682_final-fantasy-xiv-ffxiv-dark-knight-logo.png" },
            fields: [
                {
                    name: "Commands",
                    value: "💫 (input) [precision] - Do a math operation"
                }
            ]
        }))
    }
}