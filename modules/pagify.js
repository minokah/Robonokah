/* 
    Pagify

    embed: The base embed (discord.MessageEmbed)
    message: Discord.Message
    pages:  Each page in format: {name, emoji, fields, desc, image, thumbnail}

            Example:
            { name: "Page Name", emoji: "Emoji for page", fields: [fields you normally put in addFields() or something], desc: "Description", image: "url", thumbnail: "url"}

    Current: the current page (by emoji)

    Footer example: • Page 1 • [ Page 2 ] • Page 3 •
                    (Page 2 being obviously the current page)
*/

module.exports = {
    pagify(embed, message, current, pages, prev = null) {
        let footer = "•  "
        if (current == "top") current = pages[0].emoji // Default current page to top page/top of page array

        pages.forEach(data => {
            if (prev == null) {
                if (data.fields.length != null) {
                    // Add padding at the bottom of a line if it ends with \n
                    // In lists with \n at the end, remove that so it doesn't have an extra line in the list
                    for (let i = 0; i != data.fields.length; i++) {
                        if (data.fields[i].name != "⠀") {
                            data.fields[i].value = `> ${data.fields[i].value}`
                            data.fields[i].value = data.fields[i].value.replace(/\n/g, "\n> ")
                            if (data.fields[i].value[data.fields[i].value.length - 1] == " ") data.fields[i].value = data.fields[i].value.substr(0, data.fields[i].value.length - 3)
                            data.fields[i].value += "\n⠀"
                        }
                    }
                }
                else {
                    data.fields.value = `> ${data.fields.value}`
                    data.fields.value = data.fields.value.replace(/\n/g, "\n> ")
                    if (data.fields.value[data.fields.value.length - 1] == " ") data.fields.value = data.fields.value.substr(0, data.fields.value.length - 3)
                    data.fields.value += "\n⠀"
                }
            }

            if (data.emoji == current) {
                if (data.desc != null) embed.setDescription(data.desc)
                else embed.setDescription("")
                if (data.image != null) embed.setImage(data.image)
                else embed.setImage("")
                if (data.thumbnail != null) embed.setThumbnail(data.thumbnail)
                else embed.setThumbnail("")

                footer += `[ ${data.emoji}${data.name} ]  • `

                // Padding and formatting for lists and \n
                if (data.fields != null) {
                    embed.spliceFields(0, 25)
                    embed.addFields(data.fields)
                }
            }
            else footer += `${data.emoji} ${data.name}  • `
        })
        embed.setFooter(footer)

        if (prev == null) {
            message.channel.send(embed).then(msg => {
                // React if more than one emoji
                if (Object.keys(pages).length > 1) {
                    pages.forEach(data => {
                        msg.react(data.emoji).then(() => {
                            return
                        })
                    })


                    let filter = (reaction, user) => {
                        let keys = []
                        pages.forEach(data => keys.push(data.emoji))
                        return keys.includes(reaction.emoji.name) && user.id === message.author.id;
                    }

                    // Time is set to one hour
                    msg.awaitReactions(filter, { max: 1, time: 3600000, errors: ['time'] }).then(collected => {
                        try {
                            pages.forEach(data => {
                                if (collected.first().emoji.name == data.emoji) {
                                    this.pagify(embed, message, data.emoji, pages, msg)
                                    throw null
                                }
                            })
                        }
                        catch { }

                    })
                        .catch(() => msg.reactions.removeAll())
                }
            })
        }
        else {
            let msg = prev
            msg.edit(embed)

            let filter = (reaction, user) => {
                let keys = []
                pages.forEach(data => keys.push(data.emoji))
                return keys.includes(reaction.emoji.name) && user.id === message.author.id;
            }

            msg.awaitReactions(filter, { max: 1, time: 3600000, errors: ['time'] }).then(collected => {
                try {
                    pages.forEach(data => {
                        if (collected.first().emoji.name == data.emoji) {
                            this.pagify(embed, message, data.emoji, pages, msg)
                            throw null
                        }
                    })
                }
                catch { }

            })
                .catch(() => msg.reactions.removeAll())
        }
    }
}