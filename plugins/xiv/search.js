let discord = require("discord.js")
let https = require("https")

module.exports = {
    name: "xiv",
    execute(message, args) {
        if (args.length > 0) {
            let command = args.shift()
            try {
                switch (command) {
                    case "ad": {
                        message.channel.send(new discord.MessageEmbed({
                            title: "✨ Have you heard of Final Fantasy XIV?",
                            description: "...you know, the critically acclaimed MMORPG by Square Enix which includes a free trial, the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60?",
                            color: "#00a8ff",
                            url: "https://freetrial.finalfantasyxiv.com/gb/",
                            fields: [
                                { name: "No...?", value: "Well now you have! And you should play it!" },
                                { name: "Why should I?", value: "Because you probably don't have anything better to do with your time, now do ya?" }
                            ]
                        }))
                        break
                    }
                    case "map": {
                        if (args.length <= 0) {
                            message.channel.send(new discord.MessageEmbed({ title: `🗺️ Map Lookup`, color: "#ff0000", description: "You must specify a location (ex. La Noscea/Lower La Noscea)", }))
                            break
                        }
                        else {
                            let location = args.join(" ")
                            let url = location.replace(/\s/g, "%20")
                            message.channel.send(new discord.MessageEmbed({
                                title: "🗺️ " + location.replace(/\//g, " > "),
                                color: "#00a8ff",
                                image: { url: `https://www.garlandtools.org/files/maps/${url}.png` },
                                footer: { text: "No image? Your input may not be a real location" }
                            }))
                        }
                        break
                    }
                    case "search": {
                        try {
                            if (args.length <= 0) throw "You must include a search term"

                            let parsedPage = 1 // defaults to page 1 of "item"
                            let parsedType = null

                            let params = args[args.length - 1]
                            if (params[0] == "[" && params[params.length - 1] == "]") {
                                params = args.pop()
                                params = params.replace("[", "").replace("]", "")
                                params = params.split(",")
                                for (let i = 0; i != params.length; i++) {
                                    try {
                                        let value = params[i].split(":")
                                        if (value[0] == "type") parsedType = value[1]
                                        else if (value[0] == "page" && !isNaN(value[1])) parsedPage = (parseInt(value[1]) > 0) ? parseInt(value[1]) : 1 // in case someone puts something <= 0
                                    }
                                    catch { continue }
                                }
                            }

                            https.get(`https://www.garlandtools.org/api/search.php?text=${args.join(" ")}&lang=en`, response => {
                                let recieved = ""
                                response.on('data', data => recieved += data)
                                response.on('end', () => {
                                    try {
                                        recieved = JSON.parse(recieved)

                                        let results = []
                                        let totalResults = 0

                                        recieved.forEach(entry => {
                                            if (entry.type == parsedType || parsedType == null) {
                                                results.push(entry)
                                                totalResults += 1
                                            }
                                        })

                                        if (results.length <= 0) throw "No results found! Check your search terms or filters"
                                        else {
                                            let pages = []
                                            while (results.length) { pages.push(results.splice(0, 10)) }

                                            if (parsedPage > pages.length) parsedPage = pages.length // above possible page count

                                            let listingDesc = ""
                                            pages[parsedPage - 1].forEach(entry => listingDesc += `\`${entry.type} ${entry.id}\` ${entry.obj.n}\n`);

                                            message.channel.send(new discord.MessageEmbed({
                                                title: `🔍 Search`,
                                                color: "#00a8ff",
                                                thumbnail: { url: `https://garlandtools.org/files/icons/${pages[parsedPage - 1][0].type}/${pages[parsedPage - 1][0].obj.c}.png` },
                                                fields: [
                                                    { name: "📌 Query", value: `\`Input\` ${args.join(' ')}\n\`Type\` ${((parsedType != null) ? parsedType : "any")}\n\`Page\` ${parsedPage} of ${pages.length}` },
                                                    { name: "📋 Results", value: listingDesc }
                                                ]
                                            }))
                                        }
                                    }
                                    catch (error) { throw `Failed to search for ${args.join(' ')}!` }
                                })
                            })
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Search", color: "#ff0000", description: error })) }
                        break
                    }
                    case "item": {
                        try {
                            if (args.length <= 0) throw "You must include a search term"
                            if (isNaN(args[0])) throw "Your ID must be an integer"

                            https.get(`https://www.garlandtools.org/db/doc/item/en/3/${args[0]}.json`, response => {
                                let recieved = ""
                                response.on("data", data => recieved += data)
                                response.on("end", () => {
                                    recieved = JSON.parse(recieved)

                                    console.log(recieved)
                                    let baseEmbed = new discord.MessageEmbed({
                                        title: recieved.item.name,
                                        color: "#03fce8",
                                        description: "test",
                                        description: (recieved.item.description) ? recieved.item.description.replace(/<br>/g, "\n").replace(/(<([^>]+)>)/g, "") : "*No description*",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/item/${recieved.item.icon}.png` },
                                        fields: [{ name: "📖 General", value: `\`Item Level\` ${recieved.item.ilvl}\n${(recieved.item.sell_price) ? `\`Sells for\` ${recieved.item.sell_price} gil` : "\`Unsellable\`"}\n⠀` }]
                                    })

                                    let slotType = "" 
                                    // todo: setup embed/switch for individual jobs/objects (CUL, waist gear, job arms) then add in "grouped" stuff after (ex title, attr, crafts)
                                    // or make half the stuff the default case

                                    switch (recieved.item.category) {
                                        case 43: // ring?
                                        case 5: // Lancer? Weapon
                                            slotType = "Lancer's Arm" // break, oops
                                        case 39: { // Belt
                                            if (recieved.item.category == 5) slotType = "Lancer's Arm"
                                            else if (recieved.item.category == 39) slotType = "Waist" // really oops this time!!!
                                            else slotType = "Something"

                                            baseEmbed.setTitle(`🗡️ ${baseEmbed.title}`)

                                            let attrDesc = ""
                                            let attributes = Object.keys(recieved.item.attr)
                                            attributes.forEach(attr => attrDesc += `\`${attr}\` +${recieved.item.attr[attr]}\n`)

                                            baseEmbed.addFields(
                                                { name: "💪 Stats", value: `\`${slotType}\`\n\`Equippable by\` ${recieved.item.jobCategories}`, inline: true },
                                                { name: "📊 Attributes", value: attrDesc, inline: true },
                                            )
                                            break
                                        }
                                        case 46: { // Crafted Foods
                                            baseEmbed.setTitle(`🍔 ${baseEmbed.title}`)

                                            // crafting
                                            let craft = recieved.item.craft[0] // CUL is a placeholder
                                            let craftingDesc = `\`CUL\` Lv.${craft.rlvl}\n\`Yield\` ${craft.yield}\n\n\`Progress\` ${craft.progress}\n\`Quality\` ${craft.quality}\n\`Durability\` ${craft.durability}`

                                            // ingredients
                                            let ingredientDesc = ""
                                            recieved.ingredients.forEach(item => ingredientDesc += `\`${item.id}\` ${item.name}\n`)

                                            // effects, gonna assume HQ foods don't have a difference
                                            let attrDesc = ""
                                            let attributes = Object.keys(recieved.item.attr.action)
                                            attributes.forEach(attr => attrDesc += `\`${attr}\` +${recieved.item.attr.action[attr].rate}%\n`)
                                            attrDesc += "\n"
                                            attributes.forEach(attr => attrDesc += `\`HQ ${attr}\` +${recieved.item.attr_hq.action[attr].rate}%\n`)

                                            baseEmbed.addFields(
                                                { name: "🛠️ Crafting", value: craftingDesc, inline: true },
                                                { name: "✨ Effects", value: attrDesc, inline: true },
                                                { name: "🌿 Ingredients", value: ingredientDesc, inline: true }
                                            )
                                            break
                                        }

                                        default: {
                                            baseEmbed.setTitle(`📦 ${baseEmbed.title}`)
                                        }
                                    }

                                    message.channel.send(baseEmbed)
                                })
                            })
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ff0000", description: error })) }
                    }
                }
            }
            catch (error) { message.channel.send("❌ " + error) }
        }
        else message.channel.send(new discord.MessageEmbed({
            title: "☄️ Search Final Fantasy XIV",
            description: "Search for things from the critically acclaimed MMORPG",
            color: "#03fce8",
            thumbnail: { url: "https://www.clipartkey.com/mpngs/m/59-594682_final-fantasy-xiv-ffxiv-dark-knight-logo.png" },
            fields: [
                {
                    name: "Commands",
                    value: "`📰 ad` Have you tried the critically-acclaimed..." +
                        "\n`🗺️ map (location)` Bring up a map of a specified location" +
                        "\n`🔍 search (term) [type,page]` Search for stuff from the game" +
                        "\n`📦 item (id)` Get item data using the item ID"
                }
            ]
        }))
    }
}