/*
    Notes

    Take notes (displayed as a DiscordEmbed)
    Saves to the server
*/

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
            .setName("dfield")
            .setDescription("Delete a field")
            .addIntegerOption(option => option.setName('index').setDescription('Index of the field (from 0)').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("save")
            .setDescription("Save your current draft")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("load")
            .setDescription("Load and edit a saved note")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("read")
            .setDescription("Read someone's note from this server")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
            .addUserOption(option => option.setName('user').setDescription('Pick someone').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("server")
            .setDescription("See who has posted notes on this server")
        )
        .addSubcommand(sub => sub
            .setName("user")
            .setDescription("See notes this user has posted on this server")
            .addUserOption(option => option.setName('user').setDescription('Pick someone').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("delete")
            .setDescription("Delete a created note")
            .addStringOption(option => option.setName('name').setDescription('File name').setRequired(true))
            .addBooleanOption(option => option.setName('confirm').setDescription("Are you sure? You can't recover this note if you do!").setRequired(true))
        ),
    async execute(interaction) {
        try {
            switch (interaction.options.getSubcommand()) {
                // Create a new note draft, will warn you if you already have a draft of a note in cache
                case "new":
                    try {
                        if (cache[interaction.member.id] != null) { // Confirm overwrite
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
                                    await upd.update({ embeds: [new MessageEmbed({ color: "#00ff00", description: "Draft deleted. Create a new note using \`/note new\`." })], components: [] })
                                }
                            })
                        }
                        else {
                            cache[interaction.member.id] = new MessageEmbed({ // Template
                                title: "New Note",
                                description: "• I am a new note! Use `/note` commands to edit me\n• Remember to save using \`/note save\`!\n• This note will disappear after a while. You can see it again using \`/note draft\`",
                                color: 'WHITE'
                            })
                                .setFooter(`${interaction.member.user.tag}'s note`, interaction.member.user.avatarURL())

                            await interaction.reply({ embeds: [cache[interaction.member.id], new MessageEmbed({ color: "#00ff00", description: `New note draft created!` })], ephemeral: true })
                        }
                    }
                    catch (error) { throw error }
                    break

                // Display draft (preview)
                case "draft":
                    if (cache[interaction.member.id] != null) await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                    else throw "You don't have a draft to view"
                    break

                // Change title of the note
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

                // Change description of note
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

                // Change the colour (left side) of the note
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

                // Add a field to the note
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

                // Delete a field to the note
                case "dfield":
                    try {
                        if (cache[interaction.member.id] != null) {
                            let i = interaction.options.getInteger("index")
                            if (cache[interaction.member.id].fields[i] == null) throw `There is no field at index \`${i}\``
                            cache[interaction.member.id].spliceFields(i, 1)
                            await interaction.reply({ embeds: [cache[interaction.member.id]], ephemeral: true })
                        }
                        else throw "You don't have a draft to edit"
                    }
                    catch (error) { throw error }
                    break

                // Save the note. Notes are only accessible from this server
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
                                fs.writeFileSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`, JSON.stringify(cache[interaction.member.id].toJSON()), { recursive: true })
                            }
                        }
                        else throw "You don't have a draft to save"
                    }
                    catch (error) { throw error }
                    break

                // Load a note to edit
                case "load":
                    try {
                        let name = interaction.options.getString("name")

                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`)) throw `You haven't posted anything on this server yet`
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`)) throw `You don't have anything called \`${name}\``

                        cache[interaction.user.id] = new MessageEmbed(require(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`))

                        await interaction.reply({ embeds: [cache[interaction.member.id], new MessageEmbed({ color: "#00ff00", description: `Note \`${name}\` loaded!\nYou can start editing that note.` })], ephemeral: true })
                    }
                    catch (error) { throw error }
                    break

                // Pull up and read someone else's note
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

                // Show users who have made a note before on this server
                case "server":
                    try {
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}`)) throw `Nothing has been posted on this server yet`

                        let embed = new MessageEmbed({
                            title: `📝 Users with Notes from ${interaction.guild.name}`,
                            color: "#ffff00",
                            description: "These users have posted a note on this server."
                        })

                        let desc = ""
                        let dir = fs.readdirSync(`${__dirname}/saved/${interaction.guildId}`)
                        if (Object.keys(dir).length == 0) throw `Nothing has been posted on this server yet`
                        dir.forEach(user => desc += `${userMention(user)}\n`);
                        embed.addFields(formatField({ name: "🙂 Users", value: desc }))

                        await interaction.reply({ embeds: [embed] })
                    }
                    catch (error) { throw error }
                    break
                // Show a user's notes
                case "user":
                    try {
                        let user = interaction.options.getUser("user")
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${user.id}`)) throw `${userMention(user.id)} hasn't posted anything on this server yet`

                        let embed = new MessageEmbed({
                            title: `📝 Notes from ${interaction.member.id}`,
                            color: "#ffff00",
                            description: `**Server** ${interaction.guild.name}`
                        })

                        let desc = ""
                        let dir = fs.readdirSync(`${__dirname}/saved/${interaction.guildId}/${user.id}`)
                        dir.forEach(file => desc += `${file}\n`);
                        embed.addFields(formatField({ name: "📂 Notes", value: desc }))

                        await interaction.reply({ embeds: [embed] })
                    }
                    catch (error) { throw error }
                    break

                // Delete your create note
                case "delete":
                    try {
                        let name = interaction.options.getString("name")
                        let confirm = interaction.options.getBoolean("confirm")

                        if (!confirm) throw `Your note \`${name}\` gets to stay, for now`
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`)) throw `You haven't posted anything on this server yet`
                        if (!fs.existsSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`)) throw `You don't have anything called \`${name}\``

                        fs.unlinkSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}/${name}.json`)

                        let dir = fs.readdirSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`)
                        if (Object.keys(dir).length == 0) fs.rmdirSync(`${__dirname}/saved/${interaction.guildId}/${interaction.member.id}`)

                        throw `Note \`${name}\` deleted`
                    }
                    catch (error) { throw error }
                default: await interaction.reply('Notes')
            }
        }
        catch (error) { await interaction.reply({ embeds: [new MessageEmbed({ color: "#ff0000", description: error.message != null ? error.message : error })], ephemeral: true }) }
    },
}