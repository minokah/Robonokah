const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { formatField } = require('../../modules/pagify')
const { userMention } = require("@discordjs/builders")
const fs = require("fs")

let cache = {}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('note')
        .setDescription('Read or make user created notes')
        .addSubcommand(sub => sub
            .setName("new")
            .setDescription("Create a new note")
        )
        .addSubcommand(sub => sub
            .setName("draft")
            .setDescription("View your current draft")
        )
        .addSubcommand(sub => sub
            .setName("title")
            .setDescription("Set the title of your draft")
            .addStringOption(option => option.setName('title').setDescription('Title of the note').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("description")
            .setDescription("Set the description of your draft")
            .addStringOption(option => option.setName('description').setDescription('Description of the note').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("color")
            .setDescription("Set the color of your draft")
            .addStringOption(option => option.setName('hex').setDescription('Color in hexadecimal #RRGGBB').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("field")
            .setDescription("Add a field")
            .addStringOption(option => option.setName('name').setDescription('Name of the field').setRequired(true))
            .addStringOption(option => option.setName('value').setDescription('Value of the field').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("save")
            .setDescription("Save your current draft")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("read")
            .setDescription("Read someone's note from this server")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Pick someone').setRequired(true))
        ),
        /*
        .addSubcommand(sub => sub
            .setName("server")
            .setDescription("View notes created by users within the server")
        )
        .addSubcommand(sub => sub
            .setName("delete")
            .setDescription("Delete a created note")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
            .addBooleanOption(option => option.setName('confirm').setDescription("Are you sure?").setRequired(true))
        ),
        */
    async execute(interaction) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "new":
                    try {
                        if (cache[interaction.member.id] != null) {
                            await interaction.reply({
                                embeds: [cache[interaction.member.id],
                                new MessageEmbed({
                                    title: "⚠️ Draft already exists",
                                    color: "YELLOW",
                                    description: "This is currently your draft. You can edit it using \`/note\`.\n\n**Creating a new note will wipe the current draft. Are you sure?**"
                                })],
                                components: [
                                    new MessageActionRow()
                                        .addComponents(new MessageButton().setCustomId(interaction.id).setLabel("Create").setStyle("DANGER"))
                                        .addComponents(new MessageButton().setCustomId("hide").setLabel("Dismiss to hide").setStyle("SECONDARY").setDisabled(true))
                                ],
                                ephemeral: true
                            })

                            interaction.client.on('interactionCreate', async upd => {
                                if (upd.customId === String(interaction.id)) {
                                    cache[upd.member.id] = null
                                    await upd.update({ embeds: [new MessageEmbed({ color: "#ff0000", description: "Draft deleted. Create a new note using \`/note new\`." })], components: [] })
                                }
                            })
                        }
                        else {
                            cache[interaction.member.id] = new MessageEmbed({
                                title: "New Note",
                                description: "I am a new note! Use `/note` commands to edit me."
                            })
                                .setFooter(`${interaction.member.user.tag}'s note`, interaction.member.user.avatarURL())

                            await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                        }
                    }
                    catch (error) { throw error }
                    break
                case "draft":
                    if (cache[interaction.member.id] != null) await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                    else throw "You don't have a draft to view"
                    break
                case "title":
                    try {
                        if (cache[interaction.member.id] != null) {
                            cache[interaction.member.id].setTitle(interaction.options.getString("title"))
                            await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                        }
                        else throw "You don't have a draft to edit"
                    }
                    catch (error) { throw error }
                    break
                case "description":
                    try {
                        if (cache[interaction.member.id] != null) {
                            console.log(interaction.options.getString("description"))
                            cache[interaction.member.id].setDescription(interaction.options.getString("description"))
                            await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                        }
                        else throw "You don't have a draft to edit"
                    }
                    catch (error) { throw error }
                    break
                case "color":
                    try {
                        if (cache[interaction.member.id] != null) {
                            let hex = interaction.options.getString("hex")
                            try {
                                cache[interaction.member.id].setColor(hex)
                                await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                            }
                            catch { throw `\`${hex}\` probably isn't a real color` }
                        }
                        else throw "You don't have a draft to edit"
                    }
                    catch (error) { throw error }
                    break
                case "field":
                    try {
                        if (cache[interaction.member.id] != null) {
                            cache[interaction.member.id].addFields(formatField({ name: interaction.options.getString("name"), value: interaction.options.getString("value") }))
                            await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                        }
                        else throw "You don't have a draft to edit"
                    }
                    catch (error) { throw error }
                    break
                case "save":
                    try {
                        if (cache[interaction.member.id] != null) {
                            let name = interaction.options.getString("name")
                            if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`)) fs.mkdirSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`, { recursive: true })

                            if (fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`)) {
                                await interaction.reply({
                                    embeds: [cache[interaction.member.id],
                                    new MessageEmbed({
                                        title: "⚠️ Overwrite note",
                                        color: "YELLOW",
                                        description: `There is already a note saved called \`${name}\`\n\n**You can save over the note, but it can't be recovered. Are you sure?**`
                                    })],
                                    components: [
                                        new MessageActionRow()
                                            .addComponents(new MessageButton().setCustomId(interaction.id).setLabel("Overwrite").setStyle("DANGER"))
                                            .addComponents(new MessageButton().setCustomId("hide").setLabel("Dismiss to hide").setStyle("SECONDARY").setDisabled(true))
                                    ],
                                    ephemeral: true
                                })

                                interaction.client.on('interactionCreate', async upd => {
                                    if (upd.customId === String(interaction.id)) {
                                        fs.writeFileSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`, JSON.stringify(cache[interaction.member.id].toJSON()))
                                        await upd.update({ embeds: [new MessageEmbed({ color: "#00ff00", description: `Note overwritten, saved as \`${name}\`!\nYou can continue working on that same note.` })], components: [] })
                                    }
                                })
                            }
                            else {
                                await interaction.reply({ embeds: [cache[interaction.member.id], new MessageEmbed({ color: "#00ff00", description: `Note successfully saved as \`${name}\`!\nYou can continue working on that same note.` })], ephemeral: true })
                                fs.writeFileSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`, JSON.stringify(cache[interaction.member.id].toJSON()))
                            }
                        }
                        else throw "You don't have a draft to save"
                    }
                    catch (error) { throw error }
                    break
                case "read":
                    try {
                        let name = interaction.options.getString("name")
                        let user = interaction.options.getUser("user")
                        
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${user.id}`)) throw `That user hasn't posted anything in this server`
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${user.id}/${name}.json`)) throw `That user doesn't have anything called \`${name}\``

                        await interaction.reply({ embeds: [new MessageEmbed(require(`${__dirname}/saved/${interaction.guildId}/${user.id}/${name}.json`))] })
                    }
                    catch (error) { throw error }
                break
                default: await interaction.reply('Notes')
            }
        }
        catch (error) { await interaction.reply({ embeds: [new MessageEmbed({ color: "#ff0000", description: error.message != null ? error.message : error })], ephemeral: true }) }
    },
}