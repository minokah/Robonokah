const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const { formatEmbed, pagify } = require('../../modules/pagify')
const parser = require("../../modules/parser")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('notes')
        .setDescription('Read or make user created notes')
        .addSubcommand(sub => sub
            .setName("new")
            .setDescription("Create a new note")
        ),
    async execute(interaction) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "new":
                    let row = new MessageActionRow()

                    row.addComponents(
                        new MessageButton()
                            .setCustomId("editTitle")
                            .setLabel("Edit Title")
                            .setStyle("PRIMARY")
                    )
                        .addComponents(
                            new MessageButton()
                                .setCustomId("editDesc")
                                .setLabel("Edit Description")
                                .setStyle("PRIMARY")
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId("addField")
                                .setLabel("Add Field")
                                .setStyle("PRIMARY")
                        )

                    let em = new MessageEmbed({
                        description: "test",
                    })

                    interaction.client.on('interactionCreate', async upd => {
                        if (upd.isButton()) {
                            switch (upd.customID) {
                                case "editTile":
                                    
                            }

                            console.log(upd)
                            await upd.update({ embeds: [em], components: [row] })
                        }
                    });


                    await interaction.reply({ embeds: [em], components: [row] })
                    break
                default: await interaction.reply('Notes')
            }
        }
        catch (error) { await interaction.reply({ embeds: [new MessageEmbed({ color: "#ff0000", description: error.message != null ? error.message : error })], ephemeral: true }) }
    },
}