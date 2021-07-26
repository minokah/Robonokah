let discord = require("discord.js")
let pagify = require("../../modules/pagify")
let parser = require("../../modules/parser")

// Item Slot Categories
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

// Job Short/Long Hand Names
let jobList = {
    // Tanks
    1: { type: "tank", long: "Gladiator", short: "GLA", jobico: "<:gla:869022501307576390>" },
    19: { type: "tank", long: "Paladin", short: "PLD", jobico: "<:pld:869022501555011644>" },
    3: { type: "tank", long: "Marauder", short: "MRD", jobico: "<:mrd:869022501475323954>" },
    21: { type: "tank", long: "Warrior", short: "WAR", jobico: "<:war:869022501437599795>" },
    32: { type: "tank", long: "Dark Knight", short: "DRK", jobico: "<:drk:869022501366284359>" },
    37: { type: "tank", long: "Gunbreaker", short: "GNB", jobico: "<:gnb:869022501311762442>" },

    // Healers
    6: { type: "healer", long: "Conjurer", short: "CNJ", jobico: "<:cnj:869022501269798922>" },
    24: { type: "healer", long: "White Mage", short: "WHM", jobico: "<:whm:869022501311766559>" },
    28: { type: "healer", long: "Scholar", short: "SCH", jobico: "<:sch:869022501605347378>" },
    33: { type: "healer", long: "Astrologian", short: "AST", jobico: "<:ast:869022501131403304>" },

    // Melee DPS
    2: { type: "melee", long: "Pugilist", short: "PGL", jobico: "<:pgl:869022501546651658>" },
    20: { type: "melee", long: "Monk", short: "MNK", jobico: "<:mnk:869022501441773578>" },
    4: { type: "melee", long: "Lancer", short: "LNC", jobico: "<:lnc:869022501412425790>" },
    22: { type: "melee", long: "Dragoon", short: "DRG", jobico: "<:drg:869022501437571102>" },
    29: { type: "melee", long: "Rogue", short: "ROG", jobico: "<:rog:869022501190127698>" },
    30: { type: "melee", long: "Ninja", short: "NIN", jobico: "<:nin:869022501462761573>" },
    34: { type: "melee", long: "Samurai", short: "SAM", jobico: "<:sam:869022501374668821>" },

    // Physical Ranged DPS
    5: { type: "physical", long: "Archer", short: "ARC", jobico: "<:arc:869022501135581255>" },
    23: { type: "physical", long: "Bard", short: "BRD", jobico: "<:brd:869022501068496906>" },
    31: { type: "physical", long: "Machinist", short: "MCH", jobico: "<:mch:869022501458550855>" },
    38: { type: "physical", long: "Dancer", short: "DNC", jobico: "<:dnc:869022501194334289>" },

    // Magical Ranged DPS
    7: { type: "magical", long: "Thaumaturge", short: "THM", jobico: "<:thm:869022501739573248>" },
    25: { type: "magical", long: "Black Mage", short: "BLM", jobico: "<:blm:869022501110444102>" },
    26: { type: "magical", long: "Arcanist", short: "ACN", jobico: "<:smn:869022501622128710>" },
    27: { type: "magical", long: "Summoner", short: "SMN", jobico: "<:smn:869022501622128710>" },
    35: { type: "magical", long: "Red Mage", short: "RDM", jobico: "<:rdm:869022501714415626>" },
    36: { type: "magical", long: "Blue Mage", short: "BLU", jobico: "<:blu:869022501106229268>" },

    // Crafters
    8: { type: "crafter", long: "Carpenter", short: "CRP", jobico: "<:crp:869022501001388113>" },
    9: { type: "crafter", long: "Blacksmith", short: "BSM", jobico: "<:bsm:869022501139808307>" },
    10: { type: "crafter", long: "Armorer", short: "ARM", jobico: "<:arm:869022501064290344>" },
    11: { type: "crafter", long: "Goldsmith", short: "GSM", jobico: "<:gsm:869050398516854835>" },
    12: { type: "crafter", long: "Leatherworker", short: "LTW", jobico: "<:ltw:869022501416607794>" },
    13: { type: "crafter", long: "Weaver", short: "WVR", jobico: "<:wvr:869022501697617990>" },
    14: { type: "crafter", long: "Alchemist", short: "ALC", jobico: "<:alc:869022501047525396>" },
    15: { type: "crafter", long: "Culinarian", short: "CUL", jobico: "<:cul:869022501181718608>" },

    // Gatherers
    16: { type: "gatherer", long: "Miner", short: "MIN", jobico: "<:min:869022501508886588>" },
    17: { type: "gatherer", long: "Botanist", short: "BTN", jobico: "<:btn:869022501336932432>" },
    18: { type: "gatherer", long: "Fisher", short: "FSH", jobico: "<:fsh:869022501286592552>" },
}

// Market Retainers
let retainerCities = {
    1: "<:retlominsa:868259353428389898>",
    2: "<:retgridania:868259092915957850>",
    3: "<:retuldah:868259353428389898>",
    4: "<:retishgard:868259092949528626>",
    7: "<:retkugane:868259093029216306>",
    10: "<:retcrystarium:868259092949512212>"
}

// Achievements
let achievementCategories = {
    17: "Character: Commendation",
    18: "Character: Gold Saucer",
    62: "Items: Relic Weapons",
    64: "Items: Anima Weapons"
}

// Character
let playerRaces = {
    1: "Hyur",
    2: "Elezen",
    3: "Lalafell",
    4: "Miqo'te",
    5: "Roegadyn",
    6: "Au Ra",
    7: "Hrothgar",
    8: "Viera"
}

let playerTribes = {
    7: "Seeker of the Sun",
    11: "Raen",
}

let playerGuardian = {
    1: "Halone, the Fury",
    2: "Menphina, the Lover",
    3: "Thaliak, the Scholar",
    4: "Nymeia, the Spinner",
    5: "Llymlaen, the Navigator",
    6: "Oschon, the Wanderer",
    7: "Bregot, the Builder",
    8: "Rhalgr, the Destroyer",
    9: "Azeyma, the Warden",
    10: "Nald'thal, the Traders",
    11: "Nophica, the Matron",
    12: "Althyk, the Keeper"
}

let playerTown = {
    1: { name: "Limsa Lominsa", icon: "<:citylominsa:868985159477784656>" },
    2: { name: "Gridania", icon: "<:citygridania:868984941004869692>" },
    3: { name: "Ul'dah", icon: "<:cityuldah:868984873640157234>" },
}

let playerGC = {
    1: { company: "Maelstrom", title: "Storm" },
    2: { company: "Order of the Twin Adder", title: "Serpent" },
    3: { company: "Immortal Flames", title: "Flame" }
}

let gcTitles = {
    0: "Recruit",
    1: "<t> Private Third Class",
    2: "<t> Second Private Second Class",
    3: "<t> Private First Class",
    4: "<t> Corporal",
    5: "<t> Sergeant Third Class",
    6: "<t> Sergeant Second Class",
    7: "<t> Sergeant First Class",
    8: "Chief <t> Sergeant",
    9: "Second <t> Lieutenant",
    10: "First <t> Lieutenant",
    11: "<t> Captain",

    // maybe one day
    12: "Second <t> Commander",
    13: "First <t> Commander",
    14: "High <t> Commander",
    15: "Rear <t> Marshal",
    16: "Vice <t> Marshal",
    17: "<t> Marshal",
    18: "Grand <t> Marshal",
    19: "<t> Champion"
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
    execute: async function (message, args) {
        if (args.length > 0) {
            let command = args.shift()
            let params = parser.parseparams(args)

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
                            message.channel.send(new discord.MessageEmbed({ title: `🗺️ Map Lookup`, color: "#ff0000", description: "Where are we going, kupo? (ex. La Noscea/Lower La Noscea)", }))
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
                        if (args.length <= 0) throw "What's on your mind this time? (A search term is needed to... well, search)"

                        let parsedPage = 1 // defaults to page 1 of "item"
                        let parsedType = null

                        parsedType = params.type
                        parsedPage = parseInt(params.page) > 0 ? parseInt(params.page) : 1

                        try {
                            let received = await parser.reqget(`https://www.garlandtools.org/api/search.php?text=${args.join(" ")}&lang=en`)

                            let results = []

                            received.forEach(entry => {
                                if (entry.type == parsedType || parsedType == null) results.push(entry)
                            })
                            if (results.length <= 0) throw "I couldn't find anything, kupo! Maybe if you'd come and actually help this time...\n(No results found, check your search terms or filters)"
                            else if (results.length == 1) {
                                // reconstruct params string after parsed
                                Object.keys(params).forEach(key => args.push(`${key}:${params[key]},`))
                                args[args.length - 1] = `[${args[args.length - 1]}]`
                                args.unshift(results[0].id)
                                args.unshift(results[0].type)
                                this.execute(message, args)
                            }
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
                                        desc: "Use `^xiv (type) (id)` to get more info about a result",
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

                                pagify.pagify(baseEmbed, message, parsedPage, pageFields)
                            }
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔍 Item Search", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }
                        break
                    }
                    case "item": {
                        try {
                            if (args.length <= 0) throw "You must include a search term"
                            if (isNaN(args[0])) throw "Your ID must be an integer"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/item/en/3/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `${received.item.name}  \`${received.item.id}\``,
                                color: "#03fce8",
                                thumbnail: { url: `https://garlandtools.org/files/icons/item/${received.item.icon}.png` },
                            })

                            let embedProperties = {
                                emoji: "📦",
                                slotCategory: (categoryList[received.item.category] != null) ? categoryList[received.item.category].name : received.item.category,
                                craft: false,
                                food: false,
                                stats: false,
                                attributes: false,
                            }

                            // todo: setup embed/switch for individual jobs/objects (CUL, waist gear, job arms) then add in "grouped" stuff after (ex title, attr, crafts)
                            // or make half the stuff the default case

                            let statFields = [
                                { name: "📖 General", value: `**Item Level** ${received.item.ilvl}\n${(received.item.sell_price) ? `**Sells for** ${received.item.sell_price} gil` : "**Unsellable**"}\n⠀` }
                            ]

                            let embedFields = []

                            let page = "💪"
                            Object.keys(params).forEach(newPage => {
                                if (newPage == "c" || newPage.startsWith("craft")) if (received.item.craft != null) page = "🛠️"
                                if (newPage == "e" || newPage.startsWith("effect")) if (received.item.attr != null && received.item.attr.action != null) page = "🌟"
                                if (newPage == "mb" || newPage == "m" || newPage == "b" || newPage.startsWith("market") || newPage.startsWith("board")) if (received.item.tradeable != null) page = "🚀"
                            })

                            // [{ name: "*No information*", value: "This is filler", inline: true }]

                            let itype = categoryList[received.item.category]
                            if (itype != null) {
                                embedProperties.emoji = itype.emoji
                                /*
                                if (itype.stats != null && itype.stats) embedProperties.stats = true
                                if (itype.craft != null && itype.craft) embedProperties.craft = true
                                if (itype.attributes != null && itype.attributes) embedProperties.attributes = true
                                */
                            }

                            baseEmbed.setTitle(`${embedProperties.emoji} ${baseEmbed.title}`)

                            if (received.item.attr != null && received.item.attr.action == null) {
                                let attrDesc = ""
                                Object.keys(received.item.attr).forEach(attr => attrDesc += `**${attr}** +${received.item.attr[attr]}\n`)

                                statFields.push({ name: "💪 Stats", value: `**${embedProperties.slotCategory}**\n**Equippable by** ${received.item.jobCategories}`, inline: true })
                                statFields.push({ name: "📊 Attributes", value: attrDesc, inline: true })
                                statFields.push({ name: "⠀", value: "⠀", inline: true })
                            }
                            embedFields.push({ name: "Stats", emoji: "💪", fields: statFields, desc: (received.item.description) ? parser.replacehtml(received.item.description, htmlToReplace, true) : "*No description*" })

                            if (received.item.craft != null) {
                                // crafting
                                let craftingDesc = ""

                                received.item.craft.forEach(job => craftingDesc += `**${jobList[job.job] != null ? jobList[job.job].short : job.job}** Lv.${job.lvl}\n`)

                                // ingredients
                                let ingredientDesc = ""
                                received.ingredients.forEach(item => {
                                    received.item.craft[0].ingredients.forEach(ing => {
                                        if (item.id == ing.id) ingredientDesc += `\`${item.id}\` ${item.name} x ${ing.amount}\n`
                                    })
                                })
                                craftingDesc += `${received.item.craft[0].yield != null ? `**Yield** ${received.item.craft[0].yield}` : ""}\n\n**Progress** ${received.item.craft[0].progress}\n**Quality** ${received.item.craft[0].quality}\n**Durability** ${received.item.craft[0].durability}`

                                embedFields.push({
                                    name: "Crafting", emoji: "🛠️", fields: [
                                        { name: "🛠️ Crafting", value: craftingDesc, inline: true },
                                        { name: "🌿 Ingredients", value: ingredientDesc, inline: true },
                                        { name: "⠀", value: "⠀", inline: true },
                                    ]
                                })
                            }

                            if (received.item.attr != null && received.item.attr.action != null) {
                                let attrDesc = ""
                                let attributes = Object.keys(received.item.attr.action)
                                attributes.forEach(attr => attrDesc += `**${attr}** +${received.item.attr.action[attr].rate}%\n`)
                                attrDesc += "\n"
                                attributes.forEach(attr => attrDesc += `<:hq:866486713107218453>** ${attr}** +${received.item.attr_hq.action[attr].rate}%\n`)

                                embedFields.push({ name: "Effects", emoji: "🌟", fields: { name: "🌟 Effects", value: attrDesc, inline: true } })
                            }

                            if (received.item.tradeable != null && received.item.unlistable == null) {
                                let server = "crystal" // crystal gang
                                if (params.mb != null) server = params.mb
                                if (params.marketboard != null) server = params.marketboard

                                let marketReceived = await parser.reqget(`https://universalis.app/api/${server}/${received.item.id}`)
                                if (marketReceived == null) {
                                    message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ffff00", description: "🚀 **Market Board** No data found, the World/DC you entered may not be real, kupo!" }))
                                    page = "top"
                                }
                                else {
                                    marketReceived.listings.sort((a, b) => (a.pricePerUnit > b.pricePerUnit) ? 1 : -1)

                                    let nqListings = []
                                    let hqListings = []

                                    let nqCount = 0
                                    let hqCount = 0

                                    // sort entries into nq and hq
                                    for (let i = 0; i != marketReceived.listings.length; i++) {
                                        if (marketReceived.listings[i].hq == true) {
                                            if (hqCount < 5) {
                                                hqListings.push(marketReceived.listings[i])
                                                hqCount += 1
                                            }
                                        }
                                        else {
                                            if (nqCount < 5) {
                                                nqListings.push(marketReceived.listings[i])
                                                nqCount += 1
                                            }
                                        }

                                        if (nqCount == 5 && hqCount == 5) break
                                    }

                                    let nqDesc = ""
                                    nqListings.forEach(entry => {
                                        nqDesc += `${retainerCities[entry.retainerCity] != null ? retainerCities[entry.retainerCity] : entry.retainerCity} **${entry.worldName != null ? entry.worldName : entry.retainerName}**: <:gil:866367940517560390> **${entry.pricePerUnit * entry.quantity}** • ${entry.pricePerUnit} gil x ${entry.quantity}${entry.worldName != null ? ` • \`${entry.retainerName}\`\n` : "\n"}`
                                    })

                                    let hqDesc = ""
                                    hqListings.forEach(entry => {
                                        hqDesc += `${retainerCities[entry.retainerCity] != null ? retainerCities[entry.retainerCity] : entry.retainerCity} **${entry.worldName != null ? entry.worldName : entry.retainerName}**: <:gil:866367940517560390> **${entry.pricePerUnit * entry.quantity}** • ${entry.pricePerUnit} gil x ${entry.quantity}${entry.worldName != null ? ` • \`${entry.retainerName}\`\n` : "\n"}`
                                    })

                                    let cheapDesc = ""
                                    if (nqListings.length > 0) cheapDesc += `${retainerCities[nqListings[0].retainerCity]} **${nqListings[0].worldName != null ? nqListings[0].worldName : nqListings[0].retainerName}**: <:gil:866367940517560390> **${nqListings[0].pricePerUnit * nqListings[0].quantity}** • ${nqListings[0].pricePerUnit} gil x ${nqListings[0].quantity}${nqListings[0].worldName != null ? ` • \`${nqListings[0].retainerName}\`\n` : "\n"}`
                                    if (hqListings.length > 0) cheapDesc += `<:hq:866486713107218453>${retainerCities[hqListings[0].retainerCity]} **${hqListings[0].worldName != null ? hqListings[0].worldName : hqListings[0].retainerName}**: <:gil:866367940517560390> **${hqListings[0].pricePerUnit * hqListings[0].quantity}** • ${hqListings[0].pricePerUnit} gil x ${hqListings[0].quantity}${hqListings[0].worldName != null ? ` • \`${hqListings[0].retainerName}\`\n` : "\n"}`

                                    embedFields.push({
                                        name: "Market Board", emoji: "🚀", fields:
                                            [
                                                { name: "<:lfp:868274640076832768> Data Center/World", value: server },
                                                { name: "✨ Cheapest", value: cheapDesc != "" ? cheapDesc : "*No listings :(*" },
                                                { name: "🏷️ NQ Prices", value: nqListings.length > 0 ? nqDesc : "*No listings :(*" },
                                                { name: "<:hq:866486713107218453> HQ Prices", value: hqListings.length > 0 ? hqDesc : "*No listings :(*" }
                                            ]
                                    })
                                }
                            }

                            pagify.pagify(baseEmbed, message, page, embedFields)
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }
                        break
                    }
                    case "market": {
                        args.unshift("item")
                        args.push("[mb]")
                        this.execute(message, args)
                        break
                    }
                    case "action": {
                        try {
                            if (args.length <= 0) throw "I'm sure you've got tricks up your sleeve, kupo... but can you do *this*? (An ID is needed to search)"
                            if (isNaN(args[0])) throw "That's... an interesting move. (ID must be an integer)"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/action/en/2/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🌟 ${received.action.name}  \`${received.action.id}\``,
                                color: "#03fce8",
                                thumbnail: { url: `https://garlandtools.org/files/icons/action/${received.action.icon}.png` }
                            })

                            let actDesc = `${received.action.description != null ? parser.replacehtml(received.action.description, htmlToReplace, true) : "*No description*"}`

                            let generalDesc = ""
                            let spellDesc = ""

                            generalDesc += `**${jobList[received.action.job] != null ? jobList[received.action.job].long : (received.action.job == null ? "Other" : received.action.job)}** Lv. ${received.action.lvl} Action\n`
                            if (received.action.gcd != null) generalDesc += "**GCD**"
                            else generalDesc += "**Off GCD**"
                            if (received.action.cast != null) spellDesc += `**Cast** ${received.action.cast != 0 ? received.action.cast : "Instant"}\n`
                            if (received.action.recast != null) spellDesc += `**Recast** ${received.action.recast != 0 ? received.action.recast / 1000 + "s" : "Instant"}\n`
                            if (received.action.cost != null) spellDesc += `**${received.action.resource} Cost** ${received.action.cost}\n`
                            if (received.action.range != null) spellDesc += `**Range** ${received.action.range}y\n`

                            pagify.pagify(baseEmbed, message, "✨", [
                                {
                                    name: "Ability/Spell", emoji: "✨",
                                    fields: [
                                        { name: "📖 General", value: generalDesc, inline: true },
                                        { name: "✨ Ability/Spell", value: spellDesc, inline: true }
                                    ],
                                    desc: actDesc
                                }
                            ])
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🌟 Action Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }
                        break
                    }
                    case "achievement": {
                        try {
                            if (args.length <= 0) throw "Nothing? I'd consider that a remarkable achievement! (An ID is needed to search)"
                            if (isNaN(args[0])) throw "This must be some new award I've never heard of! (ID must be an integer)"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/achievement/en/2/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🏆 ${received.achievement.name}  \`${received.achievement.id}\``,
                                color: "#03fce8",
                                thumbnail: { url: `https://garlandtools.org/files/icons/achievement/${received.achievement.icon}.png` }
                            })

                            let achfields = [{ name: "💠 Points", value: received.achievement.points, inline: true }]
                            if (received.partials != null) received.partials.forEach(item => achfields.push({ name: "🎁 Reward", value: `\`${item.id}\` ${item.obj.n}`, inline: true }))
                            if (received.achievement.title != null) achfields.push({ name: "🔰 Title Obtained", value: received.achievement.title, inline: true })

                            pagify.pagify(baseEmbed, message, "",
                                [
                                    { name: achievementCategories[received.achievement.category] != null ? achievementCategories[received.achievement.category] : received.achievement.category, emoji: "", fields: achfields, desc: received.achievement.description }
                                ])
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🏆 Achievement Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }
                        break
                    }
                    case "instance": {
                        try {
                            if (args.length <= 0) throw "So, where are we headed? (An ID is needed to search)"
                            if (isNaN(args[0])) throw "I think this should be the place! Oh... maybe not, actually. (ID must be an integer)"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/instance/en/2/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🏡 ${received.instance.name}  \`${received.instance.id}\``,
                                color: "#03fce8",
                                thumbnail: { url: `https://garlandtools.org/files/icons/instance/type/${received.instance.categoryIcon}.png` },
                            })

                            let embedFields = []
                            let mainFields = [{ name: "💠 Information", value: `**Level ${received.instance.min_lvl} ${received.instance.category}**\n${received.instance.min_ilvl != null ? `**Item Level** ${received.instance.min_ilvl}\n` : ""}**Time** ${received.instance.time} minutes`, inline: true }]

                            if (received.instance.rewards != null) {
                                let rewardsDesc = ""

                                received.partials.forEach(partial => {
                                    if (partial.type == "item") {
                                        received.instance.rewards.forEach(item => {
                                            if (item == partial.id) rewardsDesc += `\`${item}\` ${partial.obj.n}\n`
                                        });
                                    }
                                });

                                if (rewardsDesc != "") mainFields.push({ name: `🎁 Possible Rewards`, value: rewardsDesc, inline: true })
                            }
                            mainFields.push({ name: "👥 Party", value: `<:tank:866470965751971890> x ${received.instance.category == "Trials" ? "2" : "1"}\n<:healer:866470993252712458> x ${received.instance.healer}\n<:dps:866471014505250877> x ${received.instance.melee + received.instance.ranged}\n`, inline: true })
                            embedFields.push({ name: received.instance.category, emoji: "🏡", fields: mainFields, desc: parser.replacehtml(received.instance.description, htmlToReplace) })

                            if (received.instance.coffers != null) {
                                let cofferFields = []

                                received.instance.coffers.forEach(coffer => {
                                    let items = ""
                                    coffer.items.forEach(item => {
                                        received.partials.forEach(partial => {
                                            if (item == partial.id) items += `\`${item}\` ${partial.obj.n}\n`
                                        });
                                    })
                                    cofferFields.push({ name: `📌 ${coffer.coords.join(", ")}`, value: items, inline: true })
                                })

                                if (cofferFields.length > 0) embedFields.push({ name: "Treasure", emoji: "👑", fields: cofferFields })
                            }

                            if (received.instance.fights != null) {
                                let bossFields = []

                                received.instance.fights.forEach(boss => {
                                    let loot = ""

                                    // loot
                                    if (boss.coffer != null) {
                                        boss.coffer.items.forEach(item => {
                                            received.partials.forEach(partial => {
                                                if (partial.type == "item" && item == partial.id) loot += `\`${item}\` ${partial.obj.n}\n`
                                            })
                                        })
                                    }

                                    // boss name
                                    received.partials.forEach(partial => {
                                        if (partial.type == "mob" && boss.mobs[0] == partial.id) bossFields.push({ name: `${boss.type == "Boss" ? "☠️" : "💀"} ${partial.obj.n}`, value: loot != "" ? loot : "*No Loot*", inline: true })
                                    })
                                })

                                if (bossFields.length > 0) embedFields.push({ name: "Bosses", emoji: "👊", fields: bossFields })
                            }

                            message.channel.send(`https://garlandtools.org/files/icons/instance/${received.instance.fullIcon}.png`)
                            pagify.pagify(baseEmbed, message, "🏡", embedFields)
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🏡 Instance Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }
                        break
                    }
                    case "quest": {
                        try {
                            if (args.length <= 0) throw "Let's make our own quest, kupo! I call being the hero! (An ID is needed to search)"
                            if (isNaN(args[0])) throw "That's a funky sounding number, don't you think? (ID must be an integer)"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/quest/en/2/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🔥 ${received.quest.name}  \`${received.quest.id}\``,
                                color: "#03fce8",
                                thumbnail: { url: `https://garlandtools.org/files/icons/event/${received.quest.eventIcon}.png` },
                            })

                            let fields = [{ name: `💠 Information`, value: `**Level ${received.quest.reqs.jobs[0].lvl}**\n${received.quest.location}`, inline: true }]

                            if (received.quest.reward != null) {
                                let unlockDesc = ""
                                let rewardsDesc = ""

                                received.partials.forEach(partial => {
                                    if (received.quest.reward[partial.type] != null) {
                                        if (partial.type == "instance") unlockDesc += `\`${partial.obj.t}\` ${partial.obj.n}\n`
                                    }

                                    if (partial.type == "item" && received.quest.reward.items != null) {
                                        received.quest.reward.items.forEach(item => {
                                            if (item.id == partial.id) rewardsDesc += `\`${item.id}\` ${partial.obj.n}\n`
                                        });
                                    }
                                });

                                if (received.quest.reward.gil != null) rewardsDesc += `<:gil:866367940517560390> ${received.quest.reward.gil} gil\n`
                                if (received.quest.reward.xp != null && received.quest.reward.xp != 0) rewardsDesc += `<:exp:866906264788009021> ${received.quest.reward.xp} xp\n`

                                if (unlockDesc != "") fields.push({ name: "🔓 Unlocks", value: unlockDesc, inline: true })
                                if (rewardsDesc != "") fields.push({ name: `🎁 Rewards`, value: rewardsDesc, inline: true })
                            }

                            let journalFields = ""
                            let entriesAdded = 0
                            for (let i = 0; i != received.quest.journal.length; i++) {
                                if (journalFields.length + received.quest.journal[i].length < 1000) {
                                    journalFields += `• ${received.quest.journal[i]}\n`
                                    entriesAdded += 1
                                }
                                else break
                            }
                            if (received.quest.journal.length - entriesAdded > 0) journalFields += `**... and ${received.quest.journal.length - entriesAdded} more entries**`
                            journalFields = parser.replacehtml(journalFields, htmlToReplace)

                            let objFields = ""
                            received.quest.objectives.forEach(obj => objFields += `• ${obj}\n`)

                            message.channel.send(`https://garlandtools.org/files/icons/quest/${received.quest.icon}.png`)
                            pagify.pagify(baseEmbed, message, "🔥",
                                [
                                    { name: received.quest.eventIcon == 71201 ? "Main Scenario Quest" : "Quest", emoji: "🔥", fields: fields, desc: parser.replacehtml(received.quest.journal[0], htmlToReplace) },
                                    { name: "Journal", emoji: "📗", fields: [{ name: "📗 Journal", value: journalFields }] },
                                    { name: "Objectives", emoji: "🎯", fields: [{ name: "🎯 Objectives", value: objFields }] }
                                ])
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "🔥 Quest Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }

                        break
                    }
                    case "leve": {
                        try {
                            if (args.length <= 0) throw "You're gonna need to give me at least something, kupo! (An ID is needed to search)"
                            if (isNaN(args[0])) throw "I'm not sure if I've heard of that leve... (ID must be an integer)"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/leve/en/3/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🔥 ${received.leve.name}  \`${received.leve.id}\``,
                                color: "#03fce8",
                            })

                            let embedFields = []

                            let leveFields = []
                            leveFields.push({ name: "💠 Information", value: `**${jobList[received.leve.jobCategory] != null ? jobList[received.leve.jobCategory].long : received.leve.jobCategory} Level ${received.leve.lvl}**`, inline: true })
                            if (received.leve.coords != null) leveFields.push({ name: `📌 (${received.leve.coords.join(", ")})`, value: "Location Name", inline: true })
                            embedFields.push({ name: "Levequest", emoji: "📑", fields: leveFields, desc: parser.replacehtml(received.leve.description, htmlToReplace) })

                            if (received.reward != null) {
                                let lootDesc = ""
                                let lootCount = 0
                                received.rewards.entries.forEach(entry => {
                                    received.partials.forEach(partial => {
                                        if (entry.item == partial.id) {
                                            if (lootDesc.length + partial.obj.n.length < 1000 && lootCount <= 10) {
                                                lootDesc += `\`${partial.id}\` ${partial.obj.n}\n`
                                                lootCount += 1
                                            }
                                        }
                                    })
                                })
                                if (Object.keys(received.rewards.entries).length - lootCount > 0) lootDesc += `**... and ${Object.keys(received.rewards.entries).length - lootCount} more entries**`
                                embedFields.push({ name: "Potential Loot", emoji: "🎁", fields: { name: "🎁 Potential Loot", value: lootDesc } })
                            }

                            message.channel.send(`https://garlandtools.org/files/icons/leve/area/${received.leve.areaicon}.png`)
                            pagify.pagify(baseEmbed, message, "📑", embedFields)
                        }
                        catch (error) { message.channel.send(new discord.MessageEmbed({ title: "📑 Levequest Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error })) }

                        break
                    }
                    case "news": {
                        let pages = []
                        let warnings = []
                        let baseEmbed = new discord.MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                        })

                        // Topics
                        try {
                            let received = await parser.reqget(`http://na.lodestonenews.com/news/topics`)
                            let fields = []

                            fields.push({ name: `🔥 Latest Topic (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `⠀\n**[${received[0].title}](${received[0].url})**\n${received[0].description}` })

                            let desc = ""
                            for (let i = 1; i != 5; i++) {
                                let numero = ""
                                if (i == 1) numero = "1️⃣"
                                else if (i == 2) numero = "2️⃣"
                                desc += `${numero != "" ? numero : "• "} **[${received[i].title}](${received[i].url})**\n`
                            }
                            fields.push({ name: `📌 Previous Topics`, value: desc })

                            pages.push({ name: `Topics`, emoji: "🔥", fields: fields, desc: "Here are the latest topics, kupo!", image: received[0].image })
                            pages.push({ name: "", emoji: "1️⃣", fields: { name: `1️⃣ Previous Topic (${received[1].time.replace("T", " @ ").replace(":00Z", "")})`, value: `⠀\n**[${received[1].title}](${received[1].url})**\n${received[1].description}` }, image: received[1].image })
                            pages.push({ name: "", emoji: "2️⃣", fields: { name: `2️⃣ Previous Topic (${received[2].time.replace("T", " @ ").replace(":00Z", "")})`, value: `⠀\n**[${received[2].title}](${received[2].url})**\n${received[2].description}` }, image: received[2].image })
                        }
                        catch { warnings.push("🔥 **Topics** Failed to get topics") }

                        // Notices
                        try {
                            let received = await parser.reqget(`http://na.lodestonenews.com/news/notices`)
                            let fields = []

                            fields.push({ name: `⛳ Latest Notice (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `⠀\n**[${received[0].title}](${received[0].url})**` })

                            let desc = ""
                            for (let i = 1; i != 4; i++) desc += `• **[${received[i].title}](${received[i].url})**\n`
                            fields.push({ name: `📌 Previous Notices`, value: desc })

                            pages.push({ name: `Notices`, emoji: "⛳", fields: fields })
                        }
                        catch { warnings.push("⛳ **Notices** Failed to get notices") }

                        // Maintenance
                        try {
                            let received = await parser.reqget(`http://na.lodestonenews.com/news/maintenance`)
                            let fields = []

                            fields.push({ name: `⚙️ Latest Maintenance (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `⠀\n**[${received[0].title}](${received[0].url})**` })

                            let desc = ""
                            for (let i = 1; i != 4; i++) desc += `• **[${received[i].title}](${received[i].url})**\n`
                            fields.push({ name: `📌 Previous Maintenance`, value: desc })

                            pages.push({ name: `Maintenance (${received[0].time.split("T")[0]})`, emoji: "⚙️", fields: fields })
                        }
                        catch { warnings.push("⚙️ **Maintenance** Failed to get maintenance messages") }

                        if (warnings.length == 3) message.channel.send(new discord.MessageEmbed({ title: "📰 Lodestone News", color: "#ffff00", description: "Failed to get anything! The Lodestone may be down, kupo!" }))
                        else {
                            if (warnings.length > 0) message.channel.send(new discord.MessageEmbed({ title: "📰 Lodestone News", color: "#ffff00", description: warnings.join("\n") }))
                            pagify.pagify(baseEmbed, message, "top", pages)
                        }

                        break
                    }
                    case "profile": {
                        try {
                            if (args[0] == "me") args[0] = 35425221
                            if (args.length <= 0) throw "If you could start describing them, maybe I can remember... (An ID is needed to search)"
                            if (isNaN(args[0])) throw "Those don't look like numbers! (ID must be an integer)"

                            let waitMessage = null
                            message.channel.send(new discord.MessageEmbed({ title: "🙎 Character Lookup", color: "#ffff00", description: "**Please Wait...** I'll try to find them, kupo! This may take a moment..." })).then(msg => waitMessage = msg)

                            let received = await parser.reqget(`https://xivapi.com/character/${args[0]}`)
                            if (received == null || received.Message == "Character not found on Lodestone") {
                                if (waitMessage != null) waitMessage.delete()
                                throw `I'm sure whoever you're thinking of must be a nice person, kupo! (Profile doesn't exist)`
                            }
                            console.log(received)

                            if (waitMessage != null) waitMessage.delete()

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🙂 ${received.Character.Name} \`${received.Character.ID}\``,
                                description: received.Character.Bio != "-" ? received.Character.Bio : "",
                                color: "#03fce8",
                            })

                            let pages = []

                            let profileFields = [
                                { name: "<:group:868274639921614919> Race/Clan", value: `${received.Character.Gender == 1 ? "♂️" : received.Character.Gender == 2 ? "♀️" : received.Character.Gender} ${playerTown[received.Character.Town].icon} **${playerRaces[received.Character.Race] != null ? playerRaces[received.Character.Race] : received.Character.Race}**\n${playerTribes[received.Character.Tribe] != null ? playerTribes[received.Character.Tribe] : received.Character.Tribe}\n${received.Character.Nameday}`, inline: true },
                                { name: "<:lfp:868274640076832768> World/Data Center", value: `**${received.Character.Server}** (${received.Character.DC})`, inline: true },
                                { name: "⠀", value: "⠀", inline: true },
                                { name: "💼 Job", value: `**${jobList[received.Character.ActiveClassJob.UnlockedState.ID != null ? received.Character.ActiveClassJob.UnlockedState.ID : 36].jobico} ${received.Character.ActiveClassJob.UnlockedState.Name}** Lv. ${received.Character.ActiveClassJob.Level}\n${received.Character.ActiveClassJob.ExpLevel} / ${received.Character.ActiveClassJob.ExpLevelMax} EXP`, inline: true },
                            ]

                            if (received.Character.GrandCompany != null) {
                                //profileFields.push({ name: "⠀", value: "⠀", inline: true })
                                profileFields.push({ name: "Grand Company", value: `**${playerGC[received.Character.GrandCompany.NameID].company}**\n${gcTitles[received.Character.GrandCompany.RankID].replace("<t>", playerGC[received.Character.GrandCompany.NameID].title)}`, inline: true })
                            }
                            profileFields.push({ name: "Guardian", value: playerGuardian[received.Character.GuardianDeity] != null ? playerGuardian[received.Character.GuardianDeity] : received.Character.GuardianDeity, inline: true })
                            pages.push({ name: "Character", emoji: "🙂", fields: profileFields, image: received.Character.Portrait })

                            // Job/Classes
                            let tankDesc = ""
                            let healerDesc = ""
                            let meleeDesc = ""
                            let physicalDesc = ""
                            let magicalDesc = ""
                            let crafterDesc = ""
                            let gathererDesc = ""

                            received.Character.ClassJobs.forEach(job => {
                                let id = job.UnlockedState.ID != null ? job.UnlockedState.ID : 36 // blue mage unlock ID is null normally

                                switch (jobList[id].type) {
                                    case "tank": { tankDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "healer": { healerDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "melee": { meleeDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "physical": { physicalDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "magical": { magicalDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "crafter": { crafterDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "gatherer": { gathererDesc += `• ${jobList[id].jobico} ${jobList[id].long} ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                }
                            })

                            pages.push({
                                name: "Jobs", emoji: "💼", desc: "Have you done your daily roulettes yet, kupo?", fields:
                                    [
                                        { name: "<:tank:869027674922840084> Tank", value: tankDesc, inline: true },
                                        { name: "<:healer:869027674927013928> Healer", value: healerDesc, inline: true },
                                        { name: "⠀", value: "⠀", inline: true },
                                        { name: "<:melee:869027674960572466> Melee DPS", value: meleeDesc, inline: true },
                                        { name: "<:physical:869040595593723914> Physical Ranged DPS", value: physicalDesc, inline: true },
                                        { name: "<:magical:869027674557906986> Magical Ranged DPS", value: magicalDesc, inline: true },
                                        { name: "<:crafter:869040667735769089> Crafter", value: crafterDesc, inline: true },
                                        { name: "<:gatherer:869040667907751936> Gatherer", value: gathererDesc, inline: true },
                                        { name: "⠀", value: "⠀", inline: true },
                                    ]
                            })

                            pagify.pagify(baseEmbed, message, "🙂", pages)
                        }
                        catch (error) {
                            message.channel.send(new discord.MessageEmbed({ title: "🙎 Character Lookup", color: "#ff0000", description: error.message != null ? `Sorry, kupo! There was a problem displaying that!\n\n${error.message}` : error }))
                            console.log(error)
                        }

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
                    value: "`🗺️ map` `🔍 search` `📦 item` `🚀 market` `🌟 action` `🏆 achievement` `🏡 instance` `🔥 quest` `📑 leve` `📰 news` `🙎 profile`"
                },
                {
                    name: "Commands",
                    value: "`✨ ad` Have you tried the critically-acclaimed..."
                }
            ]
        }))
    }
}