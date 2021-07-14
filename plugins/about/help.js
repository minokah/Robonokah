let discord = require("discord.js")

module.exports = {
    name: "help",
    execute(message) {
        message.channel.send(new discord.MessageEmbed({
            title: "What can I do?",
            description: "Using ^{term} will show more options for some utilities/fun commands",
            color: "#03fce8",
            thumbnail: { url: "https://i.imgur.com/osYUUmY.png" },
            url: "https://github.com/minokah/Robonokah",
            fields: [
                {
                    name: "Utilities",
                    value: "`☄️ xiv` Search for stuff from Final Fantasy XIV" +
                        "\n`🎲 ttt` Play tic-tac-toe" +
                        //"\n`🎲 ghub` Join a room and play minigames with (or against) people!" +
                        "\n`🧮 math` Do math operations" +
                        "\n`🎧❗ fakedfn` Stop deafening and sitting a call please"
                }
            ]
        }))
    }
}