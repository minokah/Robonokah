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
    pagify(embed, message, desc, pages, current, prev = null) {
        let footer = "•  "
        pages.forEach(data => {
            if (data.emoji == current) {
                if (data.desc != null && data.desc) embed.setDescription(desc)
                else embed.setDescription("")
                footer += `[ ${data.emoji}${data.name} ]  • `
                embed.spliceFields(0, 25)
                embed.addFields(data.fields)
            }
            else footer += `${data.emoji} ${data.name}  • `
        })
        embed.setFooter(footer)

        if (prev == null) {
            message.channel.send(embed).then(msg => {
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
                                this.pagify(embed, message, desc, pages, data.emoji, msg)
                                throw null
                            }
                        })
                    }
                    catch { }

                })
                    .catch(() => msg.reactions.removeAll())
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
                            this.pagify(embed, message, desc, pages, data.emoji, msg)
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