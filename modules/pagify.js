const { MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    /*
        formatEmbed
        
        Formats the string to how I want it to appear on Discord

        embed: MessageEmbed
    */
    formatEmbed(embed) {
        let fields = embed.fields
        if (fields.length != null) {
            // Add padding at the bottom of a line if it ends with \n
            // In lists with \n at the end, remove that so it doesn't have an extra line in the list
            for (let i = 0; i != fields.length; i++) {
                if (fields[i].name != "⠀") {
                    fields[i].value = `> ${fields[i].value}`
                    fields[i].value = fields[i].value.replace(/\n/g, "\n> ")
                    if (fields[i].value[fields[i].value.length - 1] == " ") fields[i].value = fields[i].value.substr(0, fields[i].value.length - 3) // shave off 3 empty chars at bottom
                    fields[i].value += "\n⠀"
                }
            }
        }
        else {
            fields.value = `> ${fields.value}`
            fields.value = fields.value.replace(/\n/g, "\n> ")
            if (fields.value[fields.value.length - 1] == " ") fields.value = fields.value.substr(0, fields.value.length - 3)
            fields.value += "\n⠀"
        }

        embed.setFields(fields)
        return embed
    },

    /* 
        pagify

        Create a drop down menu to navigate embed data

        interaction: interaction from interactionCreate
        pageFields: a list of MessageEmbeds with each of the keys being a drop down option
    */

    async pagify(interaction, pageEmbeds, page = null) {
        try {
            Object.keys(pageEmbeds).forEach(embed => {
                module.exports.formatEmbed(pageEmbeds[embed])
            });

            let row = new MessageActionRow()
            let pageMenu = new MessageSelectMenu()
                .setCustomId(String(interaction.id))
                .setPlaceholder("Select page")

            Object.keys(pageEmbeds).forEach(page => {
                pageMenu.addOptions({
                    label: page,
                    value: page,
                })
            });

            row.addComponents(pageMenu)

            interaction.client.on('interactionCreate', async upd => {
                if (upd.isSelectMenu() && upd.customId === String(interaction.id)) {
                    await upd.update({ embeds: [pageEmbeds[upd.values[0]]], components: [row] })
                }
            });

            await interaction.reply({ embeds: [pageEmbeds[page != null ? page : Object.keys(pageEmbeds)[0]]], components: [row] })
        }
        catch (error) { console.log(error) }
    }
}

