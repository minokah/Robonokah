let discord = require("discord.js")
let https = require("https")
let pagify = require("../../modules/pagify")
let parser = require("../../modules/parser")

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
    16: { name: "Armorer's Primary Tool", emoji: "🔨" },
    17: { name: "Armorer's Secondary Tool", emoji: "🔧" },
    14: { name: "Blacksmith's Primary Tool", emoji: "🔨" },
    15: { name: "Blacksmith's Secondary Tool", emoji: "🔧" },
    12: { name: "Carpenters's Primary Tool", emoji: ":carpentry_saw:" },
    13: { name: "Carpenters's Secondary Tool", emoji: "🔨" },
    26: { name: "Culinarian's Primary Tool", emoji: "🍳" },
    27: { name: "Culinarian's Secondary Tool", emoji: "🔪" },
    18: { name: "Goldsmith's Primary Tool", emoji: "🔨" },
    19: { name: "Goldsmith's Secondary Tool", emoji: ":manual_wheelchair:" },
    18: { name: "Leatherworkers's Primary Tool", emoji: "🔪" },
    20: { name: "Leatherworkers's Secondary Tool", emoji: "🧹" },
    22: { name: "Weaver's Primary Tool", emoji: ":sewing_needle:" },
    23: { name: "Weaver's Secondary Tool", emoji: ":manual_wheelchair:" },

    // Gatherers
    30: { name: "Botanist's Primary Tool", emoji: "🪓" },
    31: { name: "Botanist's Secondary Tool", emoji: "🪒" },
    32: { name: "Fisher's Primary Tool", emoji: "🎣" },
    33: { name: "Fisher's Secondary Tool", emoji: "🔱" },
    28: { name: "Miner's Primary Tool", emoji: "⛏️" },
    29: { name: "Miner's Secondary Tool", emoji: "🔨" },

    // Armour
    34: { name: "Head", emoji: "👒" },
    43: { name: "Ring", emoji: "💍" },
    35: { name: "Body", emoji: "🧥" },
    37: { name: "Hands", emoji: "🧤" },
    39: { name: "Waist", emoji: "👖" },
    36: { name: "Legs", emoji: "👖" },
    38: { name: "Feet", emoji: "👟" },

    // Crafted
    44: { emoji: "🧪" }, // ALC
    46: { emoji: "🍔" }, // CUL
    48: { emoji: ":rock:" }, // ???
    49: { emoji: "🔨" }, // BSM

    // Other
    81: { name: "Minion", emoji: "🧸" }
}

let craftJobList = {
    9: { long: "Blacksmith", short: "BSM" },
    8: { long: "Carpenter", short: "CRP" },
    10: { long: "Armorer", short: "ARM" },
    11: { long: "Leatherworker", short: "LTW" },
    14: { long: "Alchemist", short: "ALC" },
    15: { long: "Culinarian", short: "CUL" },
    6: { long: "Conjurer/White Mage", short: "CNJ WHM" },
    32: { long: "Dark Knight", short: "DRK" },
    33: { long: "Astrologian", short: "AST" },
}

let achievementCategories = {
    17: "Character: Commendation",
    18: "Character: Gold Saucer",
    62: "Items: Relic Weapons",
    64: "Items: Anima Weapons"
}

let htmlToReplace = [
    [/<br>/g, "\n"],
    [/<span class="highlight-green">/g, "**"],
    [/<span class="highlight-yellow">/g, "**"],
    [/<span class="highlight">/g, "**"],
    [/<span class="alternative">/g, "**"],
    [/<span class="alternative-container">/g, "**"],
    [/<\/span>/g, "**"],
    [/:/g, ""],

    [/<Emphasis>/g, "**"],
    [/<\/Emphasis>/g, "**"]
]

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
                            description: "If you haven't, you're in luck! Final Fantasy XIV is the critically acclaimed MMORPG by Square Enix which includes a **free trial, the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60 with no restrictions on playtime!**",
                            color: "#00a8ff",
                            url: "https://freetrial.finalfantasyxiv.com/gb/",
                            fields: [
                                { name: "Why should I?", value: "Catgirls, and you probably don't have anything better to do in your spare time. Do I need to say more?", inline: true },
                                { name: "Features Include", value: "`200+ Hour Story Across 3 Expansions`\n`Character Customization`\n`One Character for All Classes/Jobs`\n`Many Dungeons and Raids`\n`Free Companies/Guilds`\nAnd more!", inline: true },
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

                            let params = parser.parseparams(args)
                            parsedType = params.type
                            parsedPage = parseInt(params.page) > 0 ? parseInt(params.page) : 1

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
                                        else if (results.length == 1) this.execute(message, [results[0].type, results[0].id])
                                        else {
                                            let baseEmbed = new discord.MessageEmbed({
                                                title: `🔍 ${args.join(" ")}`,
                                                color: "#00a8ff",
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
                                                    desc: true,
                                                    fields: [
                                                        { name: "📌 Filter", value: `${(parsedType != null ? `Showing only \`${parsedType}\`` : "Showing all types")}` },
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

                                            pagify.pagify(baseEmbed, message, "Use `^xiv (type) (id)` to get more info about a result", parsedPage, pageFields)
                                        }
                                    }
                                    catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Item Search", color: "#ff0000", description: error.message != null ? `Failed to search for ${args.join(" ")}!\n\n${error.message}` : error })) }
                                })
                            })
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Item Search", color: "#ff0000", description: error.message != null ? `Failed to search for ${args.join(" ")}!\n\n${error.message}` : error })) }
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
                                        { name: "📖 General", value: `**Item Level** ${recieved.item.ilvl}\n${(recieved.item.sell_price) ? `**Sells for** ${recieved.item.sell_price} gil` : "**Unsellable**"}\n⠀` }
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
                                        Object.keys(recieved.item.attr).forEach(attr => attrDesc += `**${attr}** +${recieved.item.attr[attr]}\n`)

                                        statFields.push({ name: "💪 Stats", value: `**${embedProperties.slotCategory}**\n**Equippable by** ${recieved.item.jobCategories}`, inline: true })
                                        statFields.push({ name: "📊 Attributes", value: attrDesc, inline: true })
                                        statFields.push({ name: "⠀", value: "⠀", inline: true })
                                    }
                                    embedFields.push({ name: "Stats", emoji: "💪", fields: statFields, desc: true })

                                    if (recieved.item.craft != null) {
                                        // crafting
                                        let craftingDesc = ""

                                        recieved.item.craft.forEach(job => craftingDesc += `**${craftJobList[job.job] != null ? craftJobList[job.job].short : job.job}** Lv.${job.lvl}\n`)

                                        // ingredients
                                        let ingredientDesc = ""
                                        recieved.ingredients.forEach(item => {
                                            recieved.item.craft[0].ingredients.forEach(ing => {
                                                if (item.id == ing.id) ingredientDesc += `\`${item.id}\` ${item.name} x ${ing.amount}\n`
                                            })
                                        })
                                        craftingDesc += `${recieved.item.craft[0].yield != null ? `**Yield** ${recieved.item.craft[0].yield}` : ""}\n\n**Progress** ${recieved.item.craft[0].progress}\n**Quality** ${recieved.item.craft[0].quality}\n**Durability** ${recieved.item.craft[0].durability}`

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
                                        attributes.forEach(attr => attrDesc += `**${attr}** +${recieved.item.attr.action[attr].rate}%\n`)
                                        attrDesc += "\n"
                                        attributes.forEach(attr => attrDesc += `<:hq:866486713107218453>** ${attr}** +${recieved.item.attr_hq.action[attr].rate}%\n`)

                                        embedFields.push({ name: "Effects", emoji: "🌟", fields: { name: "🌟 Effects", value: attrDesc, inline: true }, desc: false })
                                    }

                                    let description = (recieved.item.description) ? parser.replacehtml(recieved.item.description, htmlToReplace, true) : "*No description*"

                                    pagify.pagify(baseEmbed, message, description, "💪", embedFields)
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ff0000", description: `Failed to lookup ${args.join(" ")}\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
                    }
                    case "action": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/action/en/2/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)
                                    console.log(recieved)

                                    let baseEmbed = new discord.MessageEmbed({
                                        title: `🌟 ${recieved.action.name}`, color: "#03fce8",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/action/${recieved.action.icon}.png` }
                                    })

                                    let desc = `${recieved.action.description != null ? parser.replacehtml(recieved.action.description, htmlToReplace, true) : "*No description*"}`

                                    let generalDesc = ""
                                    let spellDesc = ""

                                    generalDesc += `**${craftJobList[recieved.action.job] != null ? craftJobList[recieved.action.job].long : (recieved.action.job == null ? "Other" : recieved.action.job)}** Lv. ${recieved.action.lvl} Action\n`
                                    if (recieved.action.gcd != null) generalDesc += "**GCD**"
                                    else generalDesc += "**Off GCD**"
                                    if (recieved.action.cast != null) spellDesc += `**Cast** ${recieved.action.cast != 0 ? recieved.action.cast : "Instant"}\n`
                                    if (recieved.action.recast != null) spellDesc += `**Recast** ${recieved.action.recast != 0 ? recieved.action.recast / 1000 + "s" : "Instant"}\n`
                                    if (recieved.action.cost != null) spellDesc += `**${recieved.action.resource} Cost** ${recieved.action.cost}\n`
                                    if (recieved.action.range != null) spellDesc += `**Range** ${recieved.action.range}y\n`

                                    pagify.pagify(baseEmbed, message, desc, "✨", [
                                        {
                                            name: "Ability/Spell", emoji: "✨",
                                            fields: [
                                                { name: "📖 General", value: generalDesc, inline: true },
                                                { name: "✨ Ability/Spell", value: spellDesc, inline: true }
                                            ],
                                            desc: true
                                        }
                                    ])
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "🌟 Action Lookup", color: "#ff0000", description: `Sorry! There was a problem displaying that\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
                    }
                    case "achievement": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/achievement/en/2/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)
                                    console.log(recieved)

                                    let baseEmbed = new discord.MessageEmbed({
                                        title: `🏆 ${recieved.achievement.name}`, color: "#03fce8",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/achievement/${recieved.achievement.icon}.png` }
                                    })

                                    let achfields = [{ name: "💠 Points", value: recieved.achievement.points, inline: true }]
                                    if (recieved.partials != null) recieved.partials.forEach(item => achfields.push({ name: "🎁 Reward", value: `\`${item.id}\` ${item.obj.n}`, inline: true }))
                                    if (recieved.achievement.title != null) achfields.push({ name: "🔰 Title Obtained", value: recieved.achievement.title, inline: true })

                                    pagify.pagify(baseEmbed, message, recieved.achievement.description, "",
                                        [
                                            { name: achievementCategories[recieved.achievement.category] != null ? achievementCategories[recieved.achievement.category] : recieved.achievement.category, emoji: "", fields: achfields, desc: true }
                                        ])
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "🏆 Achievement Lookup", color: "#ff0000", description: `Sorry! There was a problem displaying that\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
                    }
                    case "instance": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/instance/en/2/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)
                                    console.log(recieved)

                                    let baseEmbed = new discord.MessageEmbed({
                                        title: `🏡 ${recieved.instance.name}`, color: "#03fce8",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/instance/type/${recieved.instance.categoryIcon}.png` },
                                    })

                                    let embedFields = []
                                    let mainFields = [{ name: "💠 Information", value: `**Level ${recieved.instance.min_lvl} ${recieved.instance.category}**\n${recieved.instance.min_ilvl != null ? `**Item Level** ${recieved.instance.min_ilvl}\n` : ""}**Time** ${recieved.instance.time} minutes`, inline: true }]

                                    if (recieved.instance.rewards != null) {
                                        let rewardsDesc = ""

                                        recieved.partials.forEach(partial => {
                                            if (partial.type == "item") {
                                                recieved.instance.rewards.forEach(item => {
                                                    if (item == partial.id) rewardsDesc += `\`${item}\` ${partial.obj.n}\n`
                                                });
                                            }
                                        });

                                        if (rewardsDesc != "") mainFields.push({ name: `🎁 Possible Rewards`, value: rewardsDesc, inline: true })
                                    }
                                    mainFields.push({ name: "👥 Party", value: `<:tank:866470965751971890> x ${recieved.instance.category == "Trials" ? "2" : "1"}\n<:healer:866470993252712458> x ${recieved.instance.healer}\n<:dps:866471014505250877> x ${recieved.instance.melee + recieved.instance.ranged}\n`, inline: true })
                                    embedFields.push({ name: recieved.instance.category, emoji: "🏡", fields: mainFields, desc: true })

                                    if (recieved.instance.coffers != null) {
                                        let cofferFields = []

                                        recieved.instance.coffers.forEach(coffer => {
                                            let items = ""
                                            coffer.items.forEach(item => {
                                                recieved.partials.forEach(partial => {
                                                    if (item == partial.id) items += `\`${item}\` ${partial.obj.n}\n`
                                                });
                                            })
                                            cofferFields.push({ name: `📌 ${coffer.coords.join(", ")}`, value: items, inline: true })
                                        })

                                        if (cofferFields.length > 0) embedFields.push({ name: "Treasure", emoji: "👑", fields: cofferFields, desc: false })
                                    }

                                    if (recieved.instance.fights != null) {
                                        let bossFields = []

                                        recieved.instance.fights.forEach(boss => {
                                            let loot = ""

                                            // loot
                                            if (boss.coffer != null) {
                                                boss.coffer.items.forEach(item => {
                                                    recieved.partials.forEach(partial => {
                                                        if (partial.type == "item" && item == partial.id) loot += `\`${item}\` ${partial.obj.n}\n`
                                                    })
                                                })
                                            }

                                            // boss name
                                            recieved.partials.forEach(partial => {
                                                if (partial.type == "mob" && boss.mobs[0] == partial.id) bossFields.push({ name: `${boss.type == "Boss" ? "☠️" : "💀"} ${partial.obj.n}`, value: loot != "" ? loot : "*No Loot*", inline: true })
                                            })
                                        })

                                        if (bossFields.length > 0) embedFields.push({ name: "Bosses", emoji: "👊", fields: bossFields, desc: false })
                                    }

                                    message.channel.send(`https://garlandtools.org/files/icons/instance/${recieved.instance.fullIcon}.png`)
                                    pagify.pagify(baseEmbed, message, parser.replacehtml(recieved.instance.description, htmlToReplace), "🏡", embedFields)

                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "🏡 Instance Lookup", color: "#ff0000", description: `Sorry! There was a problem displaying that\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
                    }
                    case "quest": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/quest/en/2/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)
                                    console.log(recieved)

                                    let baseEmbed = new discord.MessageEmbed({
                                        title: `🔥 ${recieved.quest.name}`, color: "#03fce8",
                                        thumbnail: { url: `https://garlandtools.org/files/icons/event/${recieved.quest.eventIcon}.png` },
                                    })

                                    let fields = [{ name: `💠 Information`, value: `**Level ${recieved.quest.reqs.jobs[0].lvl}**\n${recieved.quest.location}`, inline: true }]

                                    if (recieved.quest.reward != null) {
                                        let unlockDesc = ""
                                        let rewardsDesc = ""

                                        recieved.partials.forEach(partial => {
                                            if (recieved.quest.reward[partial.type] != null) {
                                                if (partial.type == "instance") unlockDesc += `\`${partial.obj.t}\` ${partial.obj.n}\n`
                                            }

                                            if (partial.type == "item" && recieved.quest.reward.items != null) {
                                                recieved.quest.reward.items.forEach(item => {
                                                    if (item.id == partial.id) rewardsDesc += `\`${item.id}\` ${partial.obj.n}\n`
                                                });
                                            }
                                        });

                                        if (recieved.quest.reward.gil != null) rewardsDesc += `<:gil:866367940517560390> ${recieved.quest.reward.gil} gil\n`
                                        if (recieved.quest.reward.xp != null && recieved.quest.reward.xp != 0) rewardsDesc += `<:exp:866906264788009021> ${recieved.quest.reward.xp} xp\n`

                                        if (unlockDesc != "") fields.push({ name: "🔓 Unlocks", value: unlockDesc, inline: true })
                                        if (rewardsDesc != "") fields.push({ name: `🎁 Rewards`, value: rewardsDesc, inline: true })
                                    }

                                    let journalFields = ""
                                    let entriesAdded = 0
                                    for (let i = 0; i != recieved.quest.journal.length; i++) {
                                        if (journalFields.length + recieved.quest.journal[i].length < 1000) {
                                            journalFields += `• ${recieved.quest.journal[i]}\n`
                                            entriesAdded += 1
                                        }
                                        else break
                                    }
                                    if (recieved.quest.journal.length - entriesAdded > 0) journalFields += `**... and ${recieved.quest.journal.length - entriesAdded} more entries**`
                                    journalFields = parser.replacehtml(journalFields, htmlToReplace)

                                    let objFields = ""
                                    recieved.quest.objectives.forEach(obj => objFields += `• ${obj}\n`)

                                    message.channel.send(`https://garlandtools.org/files/icons/quest/${recieved.quest.icon}.png`)
                                    pagify.pagify(baseEmbed, message, parser.replacehtml(recieved.quest.journal[0], htmlToReplace), "🔥",
                                        [
                                            { name: recieved.quest.eventIcon == 71201 ? "Main Scenario Quest" : "Quest", emoji: "🔥", fields: fields, desc: true },
                                            { name: "Journal", emoji: "📗", fields: [{ name: "📗 Journal", value: journalFields }], desc: false },
                                            { name: "Objectives", emoji: "🎯", fields: [{ name: "🎯 Objectives", value: objFields }], desc: false }
                                        ])
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "🔥 Quest Lookup", color: "#ff0000", description: `Sorry! There was a problem displaying that\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
                    }
                    case "leve": {
                        if (args.length <= 0) throw "You must include a search term"
                        if (isNaN(args[0])) throw "Your ID must be an integer"

                        https.get(`https://www.garlandtools.org/db/doc/leve/en/3/${args[0]}.json`, response => {
                            let recieved = ""
                            response.on("data", data => recieved += data)
                            response.on("end", () => {
                                try {
                                    recieved = JSON.parse(recieved)
                                    console.log(recieved)

                                    let baseEmbed = new discord.MessageEmbed({
                                        title: `🔥 ${recieved.leve.name}`, color: "#03fce8",
                                    })

                                    let embedFields = []

                                    let leveFields = []
                                    leveFields.push({ name: "💠 Information", value: `**${craftJobList[recieved.leve.jobCategory] != null ? craftJobList[recieved.leve.jobCategory].long : recieved.leve.jobCategory} Level ${recieved.leve.lvl}**`, inline: true })
                                    if (recieved.leve.coords != null) leveFields.push({ name: `📌 (${recieved.leve.coords.join(", ")})`, value: "Location Name", inline: true })
                                    embedFields.push({ name: "Levequest", emoji: "📑", fields: leveFields, desc: true })

                                    if (recieved.reward != null) {
                                        let lootDesc = ""
                                        let lootCount = 0
                                        recieved.rewards.entries.forEach(entry => {
                                            recieved.partials.forEach(partial => {
                                                if (entry.item == partial.id) {
                                                    if (lootDesc.length + partial.obj.n.length < 1000 && lootCount <= 10) {
                                                        lootDesc += `\`${partial.id}\` ${partial.obj.n}\n`
                                                        lootCount += 1
                                                    }
                                                }
                                            })
                                        })
                                        if (Object.keys(recieved.rewards.entries).length - lootCount > 0) lootDesc += `**... and ${Object.keys(recieved.rewards.entries).length - lootCount} more entries**`
                                        embedFields.push({ name: "Potential Loot", emoji: "🎁", fields: { name: "🎁 Potential Loot", value: lootDesc }, desc: false })
                                    }

                                    message.channel.send(`https://garlandtools.org/files/icons/leve/area/${recieved.leve.areaicon}.png`)
                                    pagify.pagify(baseEmbed, message, parser.replacehtml(recieved.leve.description, htmlToReplace), "📑", embedFields)
                                }
                                catch (error) {
                                    message.channel.send(new discord.MessageEmbed({ title: "📑 Levequest Lookup", color: "#ff0000", description: `Sorry! There was a problem displaying that\n\n${error.message}` }))
                                    console.log(error)
                                }
                            })
                        })
                        break
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
                    name: "With a type and ID, you can search using `^xiv (type) (id)`",
                    value: "`🗺️ map` `🔍 search` `📦 item` `🌟 action` `🏆 achievement` `🏡 instance` `🔥 quest` `📑 leve"
                },
                {
                    name: "Commands",
                    value: "`📰 ad` Have you tried the critically-acclaimed..."
                }
            ]
        }))
    }
}