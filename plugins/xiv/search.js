let discord = require("discord.js")
let https = require("https")
let pagify = require("../../modules/pagify")
let pparser = require("../../modules/pparser")

let categoryList = {
    // Tanks
    2: { name: "Gladiator's Arm", emoji: "🗡️" },
    3: { name: "Marauder's Arm", emoji: "🪓" },
    87: { name: "Dark Knight's Arm", emoji: "🗡️" },
    106: { name: "Gunbreaker's Arm", emoji: "🗡️" },

    // Healers
    8: { name: "One-handed Conjurer's Arm", emoji: ":magic_wand:" },
    9: { name: "Two-handed Conjurer's Arm", emoji: "🦯" },
    98: { name: "Scholar's Arm", emoji: "📗" },
    89: { name: "Astrologian's Arm", emoji: "🔮" },

    // Melee DPS
    1: { name: "Pugilist's Arm", emoji: "🥊" },
    5: { name: "Lancer's Arm", emoji: "🔱" },
    84: { name: "Rogue's Arm", emoji: "🗡️" },
    96: { name: "Samurai's Arm", emoji: "🗡️" },

    // Physical Ranged DPS
    4: { name: "Archer's Arm", emoji: "🏹" },
    88: { name: "Machinist's Arm", emoji: "🔫" },
    107: { name: "Dancer's Arm", emoji: "📀" },

    // Magic Ranged DPS
    6: { name: "One-handed Thaumaturge's Arm", emoji: ":magic_wand:" },
    7: { name: "Two-handed Thaumaturge's Arm", emoji: "🦯" },
    10: { name: "Arcanist's Grimoire", emoji: "📕" },
    97: { name: "Red Mage's Arm", emoji: "🦯" },
    105: { name: "Blue Mage's Arm", emoji: "🦯" },

    // Crafters
    24: { name: "Alchemist's Primary Tool", emoji: "💡" },
    25: { name: "Alchemist's Secondary Tool", emoji: "🏺" },
    14: { name: "Armorer's Primary Tool", emoji: "🔨" },
    17: { name: "Armorer's Secondary Tool", emoji: "🔧" },

    // Armour
    34: { name: "Head", emoji: "👒" },
    43: { name: "Ring", emoji: "💍" },
    35: { name: "Body", emoji: "🧥" },
    37: { name: "Hands", emoji: "🧤" },
    39: { name: "Waist", emoji: "👖" },
    36: { name: "Legs", emoji: "👖" },
    36: { name: "Feet", emoji: "👟" },
    
    // Crafted
    44: { emoji: "🧪" }, // ALC
    46: { emoji: "🍔" }, // CUL
    48: { emoji: ":rock:" }, // ???
    49: { emoji: "🔨" }, // BSM
}

let craftJobList = {
    9: "BSM",
    8: "CRP",
    10: "ARM",
    14: "ALC",
    15: "CUL",
}

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
                            description: "If you haven't, you're in luck! Final Fantasy XIV is the critically acclaimed MMORPG by Square Enix which includes a **free trial, the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60!**",
                            color: "#00a8ff",
                            url: "https://freetrial.finalfantasyxiv.com/gb/",
                            fields: [
                                { name: "Why should I?", value: "Catgirls, and you probably don't have anything better to do in your spare time. Do I need to say more?", inline: true },
                                { name: "Features Include", value: "`200+ Hour Story`\n`Character Customization`\n`One Character for All Classes/Jobs`\n`Many Dungeons and Raids`\n`Free Companies/Guilds`\nAnd more!", inline: true },
                            ],
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

                            let params = pparser.parse(args)
                            parsedType = params.type
                            parsedPage = (parseInt(params.page) > 0) ? parseInt(params.page) : 1

                            https.get(`https://www.garlandtools.org/api/search.php?text=${args.join(" ")}&lang=en`, response => {
                                let recieved = ""
                                response.on('data', data => recieved += data)
                                response.on('end', () => {
                                    try {
                                        recieved = JSON.parse(recieved)

                                        let results = []

                                        recieved.forEach(entry => {
                                            if (entry.type == parsedType || parsedType == null) results.push(entry)
                                        })

                                        if (results.length <= 0) throw "No results found! Check your search terms or filters"
                                        else {
                                            let baseEmbed = new discord.MessageEmbed({
                                                title: `🔍 Search`,
                                                color: "#00a8ff",
                                                //thumbnail: { url:  },
                                            })

                                            let pages = []
                                            while (results.length) { pages.push(results.splice(0, 10)) }

                                            baseEmbed.setThumbnail(`https://garlandtools.org/files/icons/${pages[parsedPage - 1][0].type}/${pages[parsedPage - 1][0].obj.c}.png`)

                                            if (parsedPage > pages.length) parsedPage = pages.length // above possible page count

                                            let descArray = []
                                            pages.forEach(page => {
                                                let listingDesc = ""
                                                page.forEach(entry => listingDesc += `\`${entry.type} ${entry.id}\` ${entry.obj.n}\n`)
                                                descArray.push(listingDesc)
                                            })

                                            let pageFields = []

                                            for (let i = 0; i != pages.length; i++) {
                                                let numero = null

                                                switch (i) {
                                                    case 0: { numero = "1️⃣"; break }
                                                    case 1: { numero = "2️⃣"; break }
                                                    case 2: { numero = "3️⃣"; break }
                                                    case 3: { numero = "4️⃣"; break }
                                                    case 4: { numero = "5️⃣"; break }
                                                    case 5: { numero = "6️⃣"; break }
                                                    case 6: { numero = "7️⃣"; break }
                                                    case 7: { numero = "8️⃣"; break }
                                                    case 8: { numero = "9️⃣"; break }
                                                    case 9: { numero = "🔟"; break }
                                                }

                                                pageFields.push({
                                                    name: "", emoji: numero,
                                                    fields: [
                                                        { name: "📌 Query", value: `\`Input\` ${args.join(' ')}\n\`Type\` ${((parsedType != null) ? parsedType : "any")}` },
                                                        { name: "📋 Results", value: descArray[i] }
                                                    ]
                                                })
                                            }

                                            switch (parsedPage) {
                                                case 1: { parsedPage = "1️⃣"; break }
                                                case 2: { parsedPage = "2️⃣"; break }
                                                case 3: { parsedPage = "3️⃣"; break }
                                                case 4: { parsedPage = "4️⃣"; break }
                                                case 5: { parsedPage = "5️⃣"; break }
                                                case 6: { parsedPage = "6️⃣"; break }
                                                case 7: { parsedPage = "7️⃣"; break }
                                                case 8: { parsedPage = "8️⃣"; break }
                                                case 9: { parsedPage = "9️⃣"; break }
                                                case 10: { parsedPage = "🔟"; break }
                                            }

                                            pagify.pagify(baseEmbed, message, "description", pageFields, parsedPage)
                                        }
                                    }
                                    catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Item Search", color: "#ff0000", description: `Failed to search for ${args.join(" ")}!\n\n${error.message}` })) }
                                })
                            })
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Item Search", color: "#ff0000", description: `Failed to search for ${args.join(" ")}\n\n${error.message}` })) }
                        break
                    }
                    case "item": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/item/en/3/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)

                                    console.log(recieved)
                                    let baseEmbed = new discord.MessageEmbed({
                                        title: recieved.item.name,
                                        color: "#03fce8",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/item/${recieved.item.icon}.png` },
                                    })

                                    let embedProperties = {
                                        emoji: "📦",
                                        slotCategory: (categoryList[recieved.item.category] != null) ? categoryList[recieved.item.category].name : recieved.item.category,
                                        craft: false,
                                        food: false,
                                        stats: false,
                                        attributes: false,
                                    }

                                    // todo: setup embed/switch for individual jobs/objects (CUL, waist gear, job arms) then add in "grouped" stuff after (ex title, attr, crafts)
                                    // or make half the stuff the default case

                                    let statFields = [
                                        { name: "📖 General", value: `\`Item Level\` ${recieved.item.ilvl}\n${(recieved.item.sell_price) ? `\`Sells for\` ${recieved.item.sell_price} gil` : "\`Unsellable\`"}\n⠀` }
                                    ]

                                    let embedFields = []

                                    // [{ name: "*No information*", value: "This is filler", inline: true }]

                                    let itype = categoryList[recieved.item.category]
                                    if (itype != null) {
                                        embedProperties.emoji = itype.emoji
                                        /*
                                        if (itype.stats != null && itype.stats) embedProperties.stats = true
                                        if (itype.craft != null && itype.craft) embedProperties.craft = true
                                        if (itype.attributes != null && itype.attributes) embedProperties.attributes = true
                                        */
                                    }

                                    baseEmbed.setTitle(`${embedProperties.emoji} ${baseEmbed.title}`)

                                    if (recieved.item.attr != null && recieved.item.attr.action == null) {
                                        let attrDesc = ""
                                        Object.keys(recieved.item.attr).forEach(attr => attrDesc += `\`${attr}\` +${recieved.item.attr[attr]}\n`)

                                        statFields.push({ name: "💪 Stats", value: `\`Slot\` ${embedProperties.slotCategory}\n\`Equippable by\` ${recieved.item.jobCategories}`, inline: true })
                                        statFields.push({ name: "📊 Attributes", value: attrDesc, inline: true })
                                        statFields.push({ name: "⠀", value: "⠀", inline: true })
                                    }
                                    embedFields.push({ name: "Stats", emoji: "💪", fields: statFields, desc: true })

                                    if (recieved.item.craft != null) {
                                        // crafting
                                        let craftingDesc = ""

                                        recieved.item.craft.forEach(job => craftingDesc += `\`${(craftJobList[job.job] != null ? craftJobList[job.job] : job.job)}\` Lv.${job.lvl}\n`)

                                        // ingredients
                                        let ingredientDesc = ""
                                        recieved.ingredients.forEach(item => {
                                            recieved.item.craft[0].ingredients.forEach(ing => {
                                                if (item.id == ing.id) ingredientDesc += `\`${item.id}\` ${item.name} x ${ing.amount}\n`
                                            })
                                        })
                                        craftingDesc += `${(recieved.item.craft[0].yield != null) ? `\`Yield\` ${recieved.item.craft[0].yield}` : ""}\n\n\`Progress\` ${recieved.item.craft[0].progress}\n\`Quality\` ${recieved.item.craft[0].quality}\n\`Durability\` ${recieved.item.craft[0].durability}`

                                        embedFields.push({
                                            name: "Crafting", emoji: "🛠️", fields: [
                                                { name: "🛠️ Crafting", value: craftingDesc, inline: true },
                                                { name: "🌿 Ingredients", value: ingredientDesc, inline: true },
                                                { name: "⠀", value: "⠀", inline: true },
                                            ], desc: false
                                        })
                                    }

                                    if (recieved.item.attr != null && recieved.item.attr.action != null) {
                                        let attrDesc = ""
                                        let attributes = Object.keys(recieved.item.attr.action)
                                        attributes.forEach(attr => attrDesc += `\`${attr}\` +${recieved.item.attr.action[attr].rate}%\n`)
                                        attrDesc += "\n"
                                        attributes.forEach(attr => attrDesc += `\`HQ ${attr}\` +${recieved.item.attr_hq.action[attr].rate}%\n`)

                                        embedFields.push({ name: "Effects", emoji: "✨", fields: { name: "✨ Effects", value: attrDesc, inline: true }, desc: false })
                                    }

                                    let description = (recieved.item.description) ? recieved.item.description.replace(/<br>/g, "\n").replace(/(<([^>]+)>)/g, "") : "*No description*"

                                    pagify.pagify(baseEmbed, message, description, embedFields, "💪")
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ff0000", description: `Failed to lookup ${args.join(" ")}\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
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