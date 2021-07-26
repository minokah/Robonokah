/* 
    pagify

    embed: the base embed (discord.MessageEmbed)
    message: Message
    desc: description to display if enabled
    pages:  the fields to dispaly on each page
            each page in format: {name, emoji, fields, desc}
    current: the current page (by emoji)

    todo: clean up copy paste in the else bracket
*/

module.exports = {
    pagify(embed, message, current, pages, prev = null) {
        let footer = "•  "
        if (current == "top") current = pages[0].emoji
        pages.forEach(data => {
            if (data.emoji == current) {
                if (data.desc != null) embed.setDescription(data.desc)
                else embed.setDescription("")
                if (data.image != null) embed.setImage(data.image)
                else embed.setImage("")
                footer += `[ ${data.emoji}${data.name} ]  • `
                if (data.fields != null) {
                    if (data.fields.length != null) {

                        // add padding at the bottom of a line if it ends with \n
                        for (let i = 0; i != data.fields.length; i++) {
                            if (data.fields[i].value[data.fields[i].value.length - 1] != "⠀") {
                                if (data.fields[i].value[data.fields[i].value.length - 1] == '\n') data.fields[i].value = data.fields[i].value += "⠀"
                                else data.fields[i].value = data.fields[i].value += "\n⠀"
                            }
                        }
                    }
                    else if (data.fields.value[data.fields.value.length - 1] != "⠀") {
                        if (data.fields.value[data.fields.value.length - 1] == '\n') data.fields.value = data.fields.value += "⠀"
                        else data.fields.value = data.fields.value += "\n⠀"
                    }

                    embed.spliceFields(0, 25)
                    embed.addFields(data.fields)
                }
            }
            else footer += `${data.emoji} ${data.name}  • `
        })
        embed.setFooter(footer)

        if (prev == null) {
            message.channel.send(embed).then(msg => {
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