const { MessageActionRow, MessageSelectMenu } = require("discord.js")


module.exports = {
    /* 
        formatField

        Formats the string to how I want it to appear on Discord

        field: a string
    */

    formatField(field) {
        field = `> ${field}`
        field = field.replace(/\n/g, "\n> ")
        if (field[field.length - 1] == " ") field = field.substr(0, field.length - 3)
        field += "\n⠀"
        return field
    },

    /* 
        pagify

        Create a drop down menu to navigate embed data

        interaction: interaction from interactionCreate
        pageFields: a list of MessageEmbeds with each of the keys being a drop down option
    */

    async pagify(interaction, pageFields, page = null) {
        pageFields = this.formatFields(pageFields)
        let row = new MessageActionRow()
        let pageMenu = new MessageSelectMenu()
            .setCustomId(String(interaction.id))
            .setPlaceholder("Select page")

        Object.keys(pageFields).forEach(page => {
            pageMenu.addOptions({
                label: page,
                value: page,
            })
        });

        row.addComponents(pageMenu)

        interaction.client.on('interactionCreate', async upd => {
            if (upd.isSelectMenu() && upd.customId === String(interaction.id)) {
                await upd.update({ embeds: [pageFields[upd.values[0]]], components: [row] })
            }
        });

        await interaction.reply({ embeds: [pageFields[page != null ? page : Object.keys(pageFields)[0]]], components: [row] })
    }
}

