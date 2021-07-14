let discord = require("discord.js")

let userEmojis = {
    "455903710212784128": "🦊"
}

let runningGame = null

module.exports = {
    name: "ghub",
    execute(message, args) {
        if (args.length > 0) {
            let command = args.shift()
            switch (command) {
                case "rooms": {
                    message.channel.send(new discord.MessageEmbed({
                        title: "🚪 Game Hub: Available Rooms",
                        description: "Minigame hub. Join a room and play with (or against) friends!",
                        color: "#7bed9f",
                        fields: [
                            { name: "🎲 1. Hangman⠀⠀⠀", value: "🐔 Chicken\n🐇 Rabbit\n🐦 Bird\n\`4 Available Slots\`", inline: true },
                            { name: "🎲 2. Tic-Tac-Toe", value: "🐵 Monkey Number One\n🐵 Monkey Number Two⠀⠀", inline: true },
                            { name: "🎲 3. Waiting...", value: `🦊 ${message.client.users.cache.get("455903710212784128")}\n🤖 ${message.client.users.cache.get("835745420705660968")}\n☄️ Meteor\n🦄 Unicorn\n🐊 Crocodile\n🐋 Whale\n\`1 Available Slot\``, inline: true },
                        ]
                    }))

                    break
                }
                case "myroom":
                    message.channel.send(new discord.MessageEmbed({
                        title: "🚪 minokah#4032's room",
                        description: "Waiting for the host to start...",
                        color: "#7bed9f",
                        fields: [
                            { name: "🎲 General⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", value: "`Game` None selected\n\n`Room Size` 8\n`Room Privacy` Open", inline: true },
                            { name: "😀 Members", value: `🦊 ${message.client.users.cache.get("455903710212784128")}\n🤖 ${message.client.users.cache.get("835745420705660968")}\n☄️ Meteor\n🦄 Unicorn\n🐊 Crocodile\n🐋 \`CLANTAG\` Whale\n\`1 Available Slot\``, inline: true },
                        ]
                    }))
                    break
            }
        }
        else {
            message.channel.send(new discord.MessageEmbed({
                title: "🎲 Game Hub",
                description: "Minigame hub. Join a room and play against people!",
                color: "#7bed9f",
                thumbnail: { url: "https://i.pinimg.com/474x/e0/e2/d4/e0e2d4c059a90ba54b0d95f5e0868c8c.jpg" },
                fields: [
                    {
                        name: "Commands",
                        value: "..."
                    }
                ]
            }))
        }
    }
}