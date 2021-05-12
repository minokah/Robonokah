const Discord = require('discord.js')

module.exports = {
    name: 'me',
    description: 'Robonokah',
    execute(message, args) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle("Robonokah")
            .setColor("#03B6FC")
            .setDescription("They played us like damn fiddle.\nHere, have some cups on for your ears.")
            .setThumbnail("https://www.pinclipart.com/picdir/big/60-608499_one-hell-of-a-deer-on-pintrest-night.png")
            .setURL("https://github.com/minokah/Robonokah")
            .addFields({
                name: "Hello there!",
                value: "minokah#0001"
            })
            .setTimestamp()
        )
    },
};