const Discord = require('discord.js')

// invisible character [⠀]

module.exports = {
    name: 'help',
    description: 'Pull up this commands list',
    execute(message, args) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle("What can I do?")
            .setColor("#00ffff")
            .setThumbnail("https://www.pinclipart.com/picdir/big/60-608499_one-hell-of-a-deer-on-pintrest-night.png")
            .setURL("https://github.com/minokah/Robonokah")
            .addFields({
                name: "**Utilities**",
                value: "Using ^{term} will show more options for some utilities"
                    + "\n\n☄️ **^xiv** - Search for stuff from FINAL FANTASY XIV"
                    + "\n⠀"
            })
            .addFields({
                name: "Commands",
                value: "❓ **^help** - Pull up this commands list"
                    + "\n💬 **^about** - Stalk me"
                    + "\n⠀"
            })
            .setTimestamp()
        )
    },
};