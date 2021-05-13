const Discord = require('discord.js')

module.exports = {
    name: 'about',
    description: 'Stalk me',
    execute(message, args) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle("Robonokah")
            .setColor("#00ffff")
            .setDescription("They played us like damn fiddle.\nHere, have some cups for your ears.")
            .setThumbnail("https://www.pinclipart.com/picdir/big/60-608499_one-hell-of-a-deer-on-pintrest-night.png")
            .setURL("https://github.com/minokah/Robonokah")
            .addFields({
                name: "Hello there!",
                value: "minokah#0001"
            })
            .addFields({
                name: "Dependancies",
                value: "discord.js"
                + "\ngarlandtools-api"
            })
            .setTimestamp()
        )
    },
};