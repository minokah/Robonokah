const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")
const { userMention } = require("@discordjs/builders")

module.exports = {
    /*
        formatField
        
        Formats a field to how I want it to appear on Discord

        field: field that goes inside a MessageEmbed
    */
    formatField(field) {
        field.value = `> ${field.value}`
        field.value = field.value.replace(/\n/g, "\n> ")
        if (field.value[field.value.length - 1] == " ") field.value = field.value.substr(0, field.value.length - 3) // shave off 3 empty chars at bottom
        field.value += "\n⠀"

        return field
    },

    /*
        formatEmbed
        
        formatField but for all fields

        embed: MessageEmbed
    */
    formatEmbed(embed) {
        let fields = embed.fields
        if (fields.length != null) {
            // Add padding at the bottom of a line if it ends with \n
            // In lists with \n at the end, remove that so it doesn't have an extra line in the list
            for (let i = 0; i != fields.length; i++) {
                if (fields[i].name != "⠀") fields[i] = this.formatField(fields[i])
            }
        }
        else fields = this.formatField(fields)

        embed.setFields(fields)
        return embed
    },

    /* 
        pagify

        Create a drop down menu to navigate embed data

        interaction: interaction from interactionCreate
        pageFields: a list of MessageEmbeds with each of the keys being a drop down option
    */

    async pagify(interaction, pageEmbeds, defer = false) {
        try {
            let user = interaction.member.id

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
                if (upd.member.id == user) {
                    if (upd.isSelectMenu() && upd.customId === String(interaction.id)) await upd.update({ embeds: [pageEmbeds[upd.values[0]]], components: [row] })
                }
                else await interaction.followUp({ embeds: [new MessageEmbed({ color: "#ff0000", description: `Only ${userMention(user)} can change the page` })], ephemeral: true })
            })

            if (!defer) await interaction.reply({ embeds: [pageEmbeds[Object.keys(pageEmbeds)[0]]], components: [row] })
            else await interaction.editReply({ embeds: [pageEmbeds[Object.keys(pageEmbeds)[0]]], components: [row] })
        }
        catch (error) { console.log(error) }
    }
}

