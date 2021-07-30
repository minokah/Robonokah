let discord = require("discord.js")
let pagify = require("../../modules/pagify")
let parser = require("../../modules/parser")

/*
    Items
*/

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
    81: { name: "Minion", emoji: "🧸" },
    86: { name: "Triple Triad Card", emoji: "🃏" }
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

// Lord of Verminion
let lovType = {
    "Poppet": "<:poppet:870450353559207947>",
    "Gadget": "<:gadget:870450353424969729>",
    "Monster": "<:monster:870450353399824414>",
    "Critter": "<:critter:870450353068462112>"
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

/*
    Player/Character
*/

// Player races
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

// Player race tribes
let playerTribes = {
    1: "Midlander",
    2: "Highlander",
    3: "Wildwood",
    4: "Duskwight",
    5: "Plainsfolk",
    6: "Dunesfolk",
    7: "Seeker of the Sun",
    8: "Keeper of the Moon",
    9: "Sea Wolf",
    10: "Hellsguard",
    11: "Raen",
    12: "Xaela",
    13: "Helion",
    14: "The Lost",
    15: "Rava",
    16: "Veena"
}

// Player guardians/the Twelve
let playerGuardian = {
    1: { name: "Halone, the Fury", ico: "<:halone:870433246360522833>" },
    2: { name: "Menphina, the Lover", ico: "<:menphina:870433246054318081>" },
    3: { name: "Thaliak, the Scholar", ico: "<:thaliak:870433246406651954>" },
    4: { name: "Nymeia, the Spinner", ico: "<:nymeia:870433245987217409>" },
    5: { name: "Llymlaen, the Navigator", ico: "<:llymlaen:870433246272430120>" },
    6: { name: "Oschon, the Wanderer", ico: "<:oschon:870433246285004820>" },
    7: { name: "Byregot, the Builder", ico: "<:byregot:870433246251466843>" },
    8: { name: "Rhalgr, the Destroyer", ico: "<:rhalgr:870433246368911460>" },
    9: { name: "Azeyma, the Warden", ico: "<:azeyma:870433246259871784>" },
    10: { name: "Nald'thal, the Trader", ico: "<:naldthal:870433246079488091>" },
    11: { name: "Nophica, the Matron", ico: "<:nophica:870433246264041472>" },
    12: { name: "Althyk, the Keeper", ico: "<:althyk:870433246171783248>" },
}

// Player starting city
let playerTown = {
    1: { name: "Limsa Lominsa", icon: "<:citylominsa:868985159477784656>" },
    2: { name: "Gridania", icon: "<:citygridania:868984941004869692>" },
    3: { name: "Ul'dah", icon: "<:cityuldah:868984873640157234>" },
}

// Grand Company name, title and rank icons
let playerGC = {
    1: {
        company: "Maelstrom", title: "Storm",
        ico: {
            1: "<:storm1:870419647416127549>",
            2: "<:storm2:870419647663575060>",
            3: "<:storm3:870419647642599454>",
            4: "<:storm4:870419647328038913>",
            5: "<:storm5:870419647340621866>",
            6: "<:storm6:870419647630037083>",
            7: "<:storm7:870419647651004466>",
            8: "<:storm8:870419647676157992>",
            9: "<:storm9:870419647663587368>",
            10: "<:storm10:870419647818760193>",
            11: "<:storm11:870419647701323776>",
        }
    },
    2: {
        company: "Order of the Twin Adder", title: "Serpent",
        ico: {
            1: "<:serpent1:870419647558717470>",
            2: "<:serpent2:870419647541940245>",
            3: "<:serpent3:870419647567114280>",
            4: "<:serpent4:870419647520985108>",
            5: "<:serpent5:870419647684563024>",
            6: "<:serpent6:870419647697137704>",
            7: "<:serpent7:870419647550341181>",
            8: "<:serpent8:870419647609077810>",
            9: "<:serpent9:870419647663603783>",
            10: "<:serpent10:870419647655194644>",
            11: "<:serpent11:870419647701323796>",
        }
    },
    3: {
        company: "Immortal Flames", title: "Flame",
        ico: {
            1: "<:flame1:870419645876830249>",
            2: "<:flame2:870419646648557588>",
            3: "<:flame3:870419646245904395>",
            4: "<:flame4:870419646623399997>",
            5: "<:flame5:870419647533572157>",
            6: "<:flame6:870419646443040819>",
            7: "<:flame7:870419646921183282>",
            8: "<:flame8:870419647692939275>",
            9: "<:flame9:870419647416115242>",
            10: "<:flame10:870419647646822490>",
            11: "<:flame:870419647709708388>",
        }
    }
}

// Grand Company ranks, <t> is replaced with the title Storm, Serpent or Flame
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

/*
    Other
*/

// specific HTML to replace (like bolding for highlight)
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

let intl = new Intl.NumberFormat("en-US") // format unix to date

module.exports = {
    name: "xiv",
    execute: async function (message, args) {
        if (args.length > 0) {
            let command = args.shift()
            let params = parser.parseparams(args)

            try {
                switch (command) {
                    // Have you heard of... (copypasta)
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
                    // Map of locations in game
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
                    // Search for everything
                    case "search": {
                        if (args.length <= 0) throw "**No search term** What's on your mind this time?"

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
                            if (results.length <= 0) throw "**No results found** I couldn't find anything, kupo! Maybe if you'd come and actually help me this time..."
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

                                if (parsedPage > pages.length) parsedPage = pages.length // above possible page count

                                let descArray = []
                                pages.forEach(page => {
                                    let listingDesc = ""
                                    page.forEach(entry => listingDesc += `\`${entry.type} ${entry.id}\` ${entry.obj.n}\n`)
                                    descArray.push(listingDesc)
                                })

                                let pageFields = []

                                for (let i = 0; i != pages.length; i++) {
                                    pageFields.push({
                                        name: "", emoji: parser.emojiNumber(i + 1),
                                        desc: "Use `^xiv (type) (id)` to get more info about a result",
                                        fields: [
                                            { name: "📌 Filter", value: `${(parsedType != null ? `Showing only \`${parsedType}\`` : "Showing all types")}` },
                                            { name: "📋 Results", value: descArray[i] }
                                        ],
                                        thumbnail: `https://garlandtools.org/files/icons/${pages[i][0].type}/${pages[i][0].obj.c}.png`
                                    })
                                }

                                parsedPage = parser.emojiNumber(parsedPage)

                                pagify.pagify(baseEmbed, message, parsedPage, pageFields)
                            }
                        }
                        catch (error) { throw error }
                        break
                    }
                    // Item lookup
                    case "item": {
                        try {
                            if (args.length <= 0) throw "**No search term** What are we looking at today?"
                            if (isNaN(args[0])) throw "**ID must be an integer** Funky sounding item if you ask me."

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/item/en/3/${args[0]}.json`)
                            if (received == null) throw `**Item not found** Is that supposed to be the item price in Gil or Kupo Nuts?`
                            console.log(received)

                            let itemData = received.item

                            let baseEmbed = new discord.MessageEmbed({
                                title: `${itemData.name}  \`${itemData.id}\``,
                                color: "#03fce8",
                            })

                            let embedProperties = {
                                emoji: "📦",
                                slotCategory: (categoryList[itemData.category] != null) ? categoryList[itemData.category].name : itemData.category,
                            }

                            // todo: setup embed/switch for individual jobs/objects (CUL, waist gear, job arms) then add in "grouped" stuff after (ex title, attr, crafts)
                            // or make half the stuff the default case

                            let statFields = [
                                { name: "📖 General", value: `**Item Level** ${itemData.ilvl}\n${(itemData.sell_price) ? `**Sells for** ${itemData.sell_price} gil` : "**Unsellable**"}` }
                            ]

                            let embedFields = []

                            let page = "💪"
                            // Swap to any page with shorthand in parameters ^xiv item id [mb] for marketboard
                            Object.keys(params).forEach(newPage => {
                                if (newPage == "c" || newPage == "crafting") if (itemData.craft != null) page = "🛠️"
                                if (newPage == "e" || newPage == "effects") if (itemData.attr != null && itemData.attr.action != null) page = "🌟"
                                if (newPage == "mb" || newPage == "marketboard") if (itemData.tradeable != null) page = "🚀"
                            })

                            // [{ name: "*No information*", value: "This is filler", inline: true }]

                            let itype = categoryList[itemData.category]
                            if (itype != null) {
                                embedProperties.emoji = itype.emoji
                                /*
                                if (itype.stats != null && itype.stats) embedProperties.stats = true
                                if (itype.craft != null && itype.craft) embedProperties.craft = true
                                if (itype.attributes != null && itype.attributes) embedProperties.attributes = true
                                */
                            }

                            baseEmbed.setTitle(`${embedProperties.emoji} ${baseEmbed.title}`)

                            let lovFields = []

                            if (itemData.attr != null && itemData.attr.action == null) {
                                let attrDesc = ""
                                let skillCost = null
                                Object.keys(itemData.attr).forEach(attr => {
                                    if (attr == "Skill Cost") skillCost = itemData.attr[attr] // skill cost and speed are special for LoV
                                    else if (attr == "Speed" && itemData.category == 81) {
                                        let stars = ""
                                        for (let i = 0; i != itemData.attr[attr]; i++) stars += "⭐"
                                        attrDesc += `**${attr}** ${stars}\n`
                                    }
                                    else attrDesc += `**${attr}** +${itemData.attr[attr]}\n`
                                })

                                if (itemData.category != 81) {
                                    statFields.push({ name: "💪 Stats", value: `**${embedProperties.slotCategory}**${itemData.jobCategories != null ? `\n**Equippable by** ${itemData.jobCategories}` : ""}`, inline: true })
                                    statFields.push({ name: "📊 Attributes", value: attrDesc, inline: true })
                                    statFields.push({ name: "⠀", value: "⠀", inline: true })
                                }
                                // Exception for Lord of Verminion, make new page instead
                                else {
                                    lovFields.push({ name: "💪 General", value: `${lovType[itemData.minionrace]} **${itemData.minionrace}**\n**Cost** ${itemData.cost}\n**Auto-attack** ${itemData.aoe != null ? "AoE" : "Single-target"}\n**Strengths** ${itemData.strengths.join(", ")}`, inline: true })
                                    lovFields.push({ name: "📊 Attributes", value: attrDesc, inline: true })
                                    lovFields.push({ name: "⠀", value: "⠀", inline: true })
                                    lovFields.push({ name: `🌟 ${itemData.specialactionname} (${itemData.minionskilltype})`, value: `${parser.replacehtml(itemData.specialactiondescription, htmlToReplace)}\n\n**Points** ${skillCost}\n**Angle** ${itemData.skill_angle}°`, inline: true })
                                }
                            }
                            embedFields.push({ name: "Stats", emoji: "💪", fields: statFields, desc: (itemData.description) ? parser.replacehtml(itemData.description, htmlToReplace, true) : "*No description*", thumbnail: `https://garlandtools.org/files/icons/item/${itemData.icon}.png` })
                            if (lovFields.length > 0) embedFields.push({ name: "Lord of Verminion", emoji: "🧸", fields: lovFields, desc: itemData.tooltip.replace(/\r\n/g, " "), thumbnail: `https://garlandtools.org/files/icons/item/${itemData.icon}.png` })

                            // Crafting
                            if (itemData.craft != null) {
                                // crafting
                                let craftingDesc = ""

                                itemData.craft.forEach(job => craftingDesc += `**${jobList[job.job] != null ? jobList[job.job].short : job.job}** Lv.${job.lvl}\n`)

                                // ingredients
                                let ingredientDesc = ""
                                received.ingredients.forEach(item => {
                                    itemData.craft[0].ingredients.forEach(ing => {
                                        if (item.id == ing.id) ingredientDesc += `\`${item.id}\` ${item.name} x ${ing.amount}\n`
                                    })
                                })
                                craftingDesc += `${itemData.craft[0].yield != null ? `**Yield** ${itemData.craft[0].yield}\n` : ""}\n**Progress** ${itemData.craft[0].progress}\n**Quality** ${itemData.craft[0].quality}\n**Durability** ${itemData.craft[0].durability}`

                                embedFields.push({
                                    name: "Crafting", emoji: "🛠️",
                                    fields: [
                                        { name: "🛠️ Crafting", value: craftingDesc, inline: true },
                                        { name: "🌿 Ingredients", value: ingredientDesc, inline: true },
                                        { name: "⠀", value: "⠀", inline: true },
                                    ]
                                })
                            }

                            // Effects
                            if (itemData.attr != null && itemData.attr.action != null) {
                                let attrDesc = ""
                                let attributes = Object.keys(itemData.attr.action)
                                attributes.forEach(attr => attrDesc += `**${attr}** +${itemData.attr.action[attr].rate}%\n`)
                                attrDesc += "\n"
                                attributes.forEach(attr => attrDesc += `<:hq:866486713107218453>** ${attr}** +${itemData.attr_hq.action[attr].rate}%\n`)

                                embedFields.push({ name: "Effects", emoji: "🌟", fields: { name: "🌟 Effects", value: attrDesc, inline: true } })
                            }

                            // Market board data
                            if (itemData.tradeable != null && itemData.unlistable == null) {
                                let server = "crystal" // crystal gang
                                if (params.mb != null) server = params.mb
                                if (params.marketboard != null) server = params.marketboard

                                let marketReceived = await parser.reqget(`https://universalis.app/api/${server}/${itemData.id}`)
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
                                        name: "Market Board", emoji: "🚀",
                                        fields: [
                                            { name: "<:lfp:868274640076832768> Data Center/World", value: `**${server.charAt(0).toUpperCase() + server.slice(1)}**` },
                                            { name: "✨ Cheapest", value: cheapDesc != "" ? cheapDesc : "*No listings :(*" },
                                            { name: "🏷️ NQ Prices", value: nqListings.length > 0 ? nqDesc : "*No listings :(*" },
                                            { name: "<:hq:866486713107218453> HQ Prices", value: hqListings.length > 0 ? hqDesc : "*No listings :(*" }
                                        ]
                                    })
                                }
                            }

                            // Triple Triad
                            if (itemData.tripletriad != null) {
                                let stars = ""
                                for (let i = 0; i != itemData.tripletriad.rarity; i++) stars += "⭐"

                                embedFields.push({
                                    name: "Triple Triad", emoji: "🃏",
                                    fields: [
                                        { name: `<:triad:870469313717481493> ${itemData.name.split("Card")[0]}`, value: `${stars}\n${itemData.tripletriad.en.description}`, inline: true },
                                        { name: "⚖️ Sides", value: `⠀⠀${parser.emojiNumber(itemData.tripletriad.top)}\n${parser.emojiNumber(itemData.tripletriad.left)}⠀⠀${parser.emojiNumber(itemData.tripletriad.right)}\n⠀⠀${parser.emojiNumber(itemData.tripletriad.bottom)}`, inline: true },
                                        { name: "⠀", value: "⠀", inline: true },
                                        { name: "💪 General", value: `${itemData.tripletriad.sellMgp != null ? `**Sells for** ${itemData.tripletriad.sellMgp} MGP` : "**Unsellable**"}` },
                                    ],
                                    thumbnail: `https://garlandtools.org/files/icons/triad/plate/${itemData.tripletriad.plate}.png`
                                })
                            }

                            pagify.pagify(baseEmbed, message, page, embedFields)
                        }
                        catch (error) { throw error }
                        break
                    }
                    // Redirect to item lookup, market board page
                    case "market": {
                        let server = "crystal"
                        Object.keys(params).forEach(key => server = key)
                        args.unshift("item")
                        args.push(`[mb:${server}]`)
                        this.execute(message, args)
                        break
                    }
                    case "action": {
                        try {
                            if (args.length <= 0) throw "**No search term** I'm sure you've got tricks up your sleeve, kupo... but can you do *this*?"
                            if (isNaN(args[0])) throw "**ID must be an integer** That's... an interesting move."

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/action/en/2/${args[0]}.json`)
                            if (received == null) throw `**Action not found** I've never heard of that move before, could you teach me it?`
                            console.log(received)

                            let actionData = received.action

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🌟 ${actionData.name}  \`${actionData.id}\``,
                                color: "#03fce8",
                            })

                            let actDesc = `${actionData.description != null ? parser.replacehtml(actionData.description, htmlToReplace, true) : "*No description*"}`

                            let generalDesc = ""
                            let spellDesc = ""

                            generalDesc += `**${jobList[actionData.job] != null ? jobList[actionData.job].long : (actionData.job == null ? "Other" : actionData.job)}** Lv. ${actionData.lvl} Action\n`
                            if (actionData.gcd != null) generalDesc += "**GCD**"
                            else generalDesc += "**Off GCD**"
                            if (actionData.cast != null) spellDesc += `**Cast** ${actionData.cast != 0 ? actionData.cast : "Instant"}\n`
                            if (actionData.recast != null) spellDesc += `**Recast** ${actionData.recast != 0 ? actionData.recast / 1000 + "s" : "Instant"}\n`
                            if (actionData.cost != null) spellDesc += `**${actionData.resource} Cost** ${actionData.cost}\n`
                            if (actionData.range != null) spellDesc += `**Range** ${actionData.range}y\n`

                            pagify.pagify(baseEmbed, message, "✨", [
                                {
                                    name: "Ability/Spell", emoji: "✨",
                                    fields: [
                                        { name: "📖 General", value: generalDesc, inline: true },
                                        { name: "✨ Ability/Spell", value: spellDesc, inline: true }
                                    ],
                                    desc: actDesc,
                                    thumbnail: `https://garlandtools.org/files/icons/action/${actionData.icon}.png`
                                }
                            ])
                        }
                        catch (error) { throw error }
                        break
                    }
                    case "achievement": {
                        try {
                            if (args.length <= 0) throw "**No search term** Nothing? I'd consider that a remarkable achievement!"
                            if (isNaN(args[0])) throw "**ID must be an integer** Are trophies labelled with numbers or words?"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/achievement/en/2/${args[0]}.json`)
                            if (received == null) throw `**Achievement not found** This must be some new trophy they're giving out!`
                            console.log(received)

                            let achievementData = achievementData

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🏆 ${achievementData.name}  \`${achievementData.id}\``,
                                color: "#03fce8",
                            })

                            let achfields = [{ name: "💠 Points", value: achievementData.points, inline: true }]
                            if (received.partials != null) received.partials.forEach(item => achfields.push({ name: "🎁 Reward", value: `\`${item.id}\` ${item.obj.n}`, inline: true }))
                            if (achievementData.title != null) achfields.push({ name: "🔰 Title Obtained", value: achievementData.title, inline: true })

                            pagify.pagify(baseEmbed, message, "",
                                [
                                    { name: achievementCategories[achievementData.category] != null ? achievementCategories[achievementData.category] : achievementData.category, emoji: "", fields: achfields, desc: achievementData.description, thumbnail: `https://garlandtools.org/files/icons/achievement/${achievementData.icon}.png` }
                                ])
                        }
                        catch (error) { throw error }
                        break
                    }
                    case "instance": {
                        try {
                            if (args.length <= 0) throw "**No search term** So, where are we headed today?"
                            if (isNaN(args[0])) throw "**ID must be an integer** I think this should be the place! Oh... maybe not, actually."

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/instance/en/2/${args[0]}.json`)
                            if (received == null) throw `The ${command} ID you inputted isn't real, kupo!`
                            console.log(received)

                            let instanceData = received.instance

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🏡 ${instanceData.name}  \`${instanceData.id}\``,
                                color: "#03fce8",
                            })

                            let embedFields = []
                            let mainFields = [{ name: "💠 Information", value: `**Level ${instanceData.min_lvl} ${instanceData.category}**\n${instanceData.min_ilvl != null ? `**Item Level** ${instanceData.min_ilvl}\n` : ""}**Time** ${instanceData.time} minutes`, inline: true }]

                            if (instanceData.rewards != null) {
                                let rewardsDesc = ""

                                received.partials.forEach(partial => {
                                    if (partial.type == "item") {
                                        instanceData.rewards.forEach(item => {
                                            if (item == partial.id) rewardsDesc += `\`${item}\` ${partial.obj.n}\n`
                                        });
                                    }
                                });

                                if (rewardsDesc != "") mainFields.push({ name: `🎁 Possible Rewards`, value: rewardsDesc, inline: true })
                            }
                            mainFields.push({ name: "👥 Party", value: `<:tank:866470965751971890> x ${instanceData.category == "Trials" ? "2" : "1"}\n<:healer:866470993252712458> x ${instanceData.healer}\n<:dps:866471014505250877> x ${instanceData.melee + instanceData.ranged}\n`, inline: true })
                            embedFields.push({ name: instanceData.category, emoji: "🏡", fields: mainFields, desc: parser.replacehtml(instanceData.description, htmlToReplace), thumbnail: `https://garlandtools.org/files/icons/instance/type/${instanceData.categoryIcon}.png` })

                            if (instanceData.coffers != null) {
                                let cofferFields = []

                                instanceData.coffers.forEach(coffer => {
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

                            if (instanceData.fights != null) {
                                let bossFields = []

                                instanceData.fights.forEach(boss => {
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

                            message.channel.send(`https://garlandtools.org/files/icons/instance/${instanceData.fullIcon}.png`)
                            pagify.pagify(baseEmbed, message, "🏡", embedFields)
                        }
                        catch (error) { throw error }
                        break
                    }
                    case "quest": {
                        try {
                            if (args.length <= 0) throw "**No search term** Let's make our own quest, kupo! I call being the hero!"
                            if (isNaN(args[0])) throw "**ID must be an integer** That's a funky sounding number, don't you think?"

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/quest/en/2/${args[0]}.json`)
                            if (received == null) throw `**Quest not found** The quest doesn't seem to exist, kupo!`
                            console.log(received)

                            let questData = received.quest

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🔥 ${questData.name}  \`${questData.id}\``,
                                color: "#03fce8",
                            })

                            let fields = [{ name: `💠 Information`, value: `**Level ${questData.reqs.jobs[0].lvl}**\n${questData.location}`, inline: true }]

                            if (questData.reward != null) {
                                let unlockDesc = ""
                                let rewardsDesc = ""

                                received.partials.forEach(partial => {
                                    if (questData.reward[partial.type] != null) {
                                        if (partial.type == "instance") unlockDesc += `\`${partial.obj.t}\` ${partial.obj.n}\n`
                                    }

                                    if (partial.type == "item" && questData.reward.items != null) {
                                        questData.reward.items.forEach(item => {
                                            if (item.id == partial.id) rewardsDesc += `\`${item.id}\` ${partial.obj.n}\n`
                                        });
                                    }
                                });

                                if (questData.reward.gil != null) rewardsDesc += `<:gil:866367940517560390> ${questData.reward.gil} gil\n`
                                if (questData.reward.xp != null && questData.reward.xp != 0) rewardsDesc += `<:exp:866906264788009021> ${questData.reward.xp} EXP\n`

                                if (unlockDesc != "") fields.push({ name: "🔓 Unlocks", value: unlockDesc, inline: true })
                                if (rewardsDesc != "") fields.push({ name: `🎁 Rewards`, value: rewardsDesc, inline: true })
                            }

                            let journalFields = ""
                            let entriesAdded = 0
                            for (let i = 0; i != questData.journal.length; i++) {
                                if (journalFields.length + questData.journal[i].length < 1000) {
                                    journalFields += `• ${questData.journal[i]}\n`
                                    entriesAdded += 1
                                }
                                else break
                            }
                            if (questData.journal.length - entriesAdded > 0) journalFields += `**... and ${questData.journal.length - entriesAdded} more entries**`
                            journalFields = parser.replacehtml(journalFields, htmlToReplace)

                            let objFields = ""
                            questData.objectives.forEach(obj => objFields += `• ${obj}\n`)

                            message.channel.send(`https://garlandtools.org/files/icons/quest/${questData.icon}.png`)
                            pagify.pagify(baseEmbed, message, "🔥",
                                [
                                    { name: questData.eventIcon == 71201 ? "Main Scenario Quest" : "Quest", emoji: "🔥", fields: fields, desc: parser.replacehtml(questData.journal[0], htmlToReplace), thumbnail: `https://garlandtools.org/files/icons/event/${questData.eventIcon}.png` },
                                    { name: "Journal", emoji: "📗", fields: [{ name: "📗 Journal", value: journalFields }] },
                                    { name: "Objectives", emoji: "🎯", fields: [{ name: "🎯 Objectives", value: objFields }] }
                                ])
                        }
                        catch (error) { throw error }
                        break
                    }
                    case "leve": {
                        try {
                            if (args.length <= 0) throw "**No search term** You're gonna need to give me at least something, kupo!"
                            if (isNaN(args[0])) throw "**ID must be an integer** I'm not sure if I've heard of that leve..."

                            let received = await parser.reqget(`https://www.garlandtools.org/db/doc/leve/en/3/${args[0]}.json`)
                            if (received == null) throw `**Leve not found** I've never heard of this leve before...`
                            console.log(received)

                            let leveData = received.leve

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🔥 ${leveData.name}  \`${leveData.id}\``,
                                color: "#03fce8",
                            })

                            let embedFields = []

                            let leveFields = []
                            leveFields.push({ name: "💠 Information", value: `**${jobList[leveData.jobCategory] != null ? jobList[leveData.jobCategory].long : leveData.jobCategory} Level ${leveData.lvl}**`, inline: true })
                            if (leveData.coords != null) leveFields.push({ name: `📌 (${leveData.coords.join(", ")})`, value: "Location Name", inline: true })
                            embedFields.push({ name: "Levequest", emoji: "📑", fields: leveFields, desc: parser.replacehtml(leveData.description, htmlToReplace) })

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

                            message.channel.send(`https://garlandtools.org/files/icons/leve/area/${leveData.areaicon}.png`)
                            pagify.pagify(baseEmbed, message, "📑", embedFields)
                        }
                        catch (error) { throw error }
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

                            fields.push({ name: `🔥 Latest Topic (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[0].title}](${received[0].url})**\n${received[0].description}` })

                            let desc = ""
                            for (let i = 1; i != 5; i++) {
                                let numero = ""
                                if (i == 1) numero = "1️⃣"
                                else if (i == 2) numero = "2️⃣"
                                desc += `${numero != "" ? numero : "• "} **[${received[i].title}](${received[i].url})**\n`
                            }
                            fields.push({ name: `📌 Previous Topics`, value: desc })

                            pages.push({ name: `Topics`, emoji: "🔥", fields: fields, desc: "Here are the latest topics, kupo!", image: received[0].image })
                            pages.push({ name: "", emoji: "1️⃣", fields: { name: `1️⃣ Previous Topic (${received[1].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[1].title}](${received[1].url})**\n${received[1].description}` }, image: received[1].image })
                            pages.push({ name: "", emoji: "2️⃣", fields: { name: `2️⃣ Previous Topic (${received[2].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[2].title}](${received[2].url})**\n${received[2].description}` }, image: received[2].image })
                        }
                        catch { warnings.push("🔥 **Topics** Failed to get topics") }

                        // Notices
                        try {
                            let received = await parser.reqget(`http://na.lodestonenews.com/news/notices`)
                            let fields = []

                            fields.push({ name: `⛳ Latest Notice (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[0].title}](${received[0].url})**` })

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

                            fields.push({ name: `⚙️ Latest Maintenance (${received[0].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[0].title}](${received[0].url})**` })

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
                    /*
                    case "psearch": {
                        try {
                            if (args.length <= 0) throw "**No search term** Who are we finding today, kupo?"

                            let waitMessage = null
                            message.channel.send(new discord.MessageEmbed({ title: "🙂 Player Search", color: "#ffff00", description: "**Please Wait** I'll try to find them, kupo! This may take a moment..." })).then(msg => waitMessage = msg)

                            let received = await parser.reqget(`https://xivapi.com/character/search?name=${args.join(" ")}`) // &server=[server]
                            if (waitMessage != null) waitMessage.delete()
                            if (received == null || received.Pagination.Results == 0) throw `**No search results** I couldn't find anyone named that, kupo!`

                            let pages = []
                            while (results.length) { pages.push(results.splice(0, 10)) }

                            console.log(received)
                        }
                        catch (error) { throw error }
                        break
                    }
                    */
                    case "profile": {
                        try {
                            if (args[0] == "me") args[0] = 35425221
                            if (args.length <= 0) throw "**No search term** If you could start describing them, maybe I can remember..."
                            if (isNaN(args[0])) throw "**ID must be an integer** Those don't look like numbers!"

                            let waitMessage = null
                            message.channel.send(new discord.MessageEmbed({ title: "🙎 Character Lookup", color: "#ffff00", description: "**Please Wait** I'll try to find them, kupo! This may take a moment..." })).then(msg => waitMessage = msg)

                            let received = await parser.reqget(`https://xivapi.com/character/${args[0]}?data=FC`)
                            if (waitMessage != null) waitMessage.delete()
                            if (received == null || received.Message == "Character not found on Lodestone") throw `**Profile doesn't exist** I'm sure whoever you're thinking of must be a nice person, kupo!`
                            console.log(received)

                            let charData = received.Character
                            let fcData = received.FreeCompany

                            let baseEmbed = new discord.MessageEmbed({
                                title: `🙂 ${fcData != null ? `<${fcData.Tag}>` : ""} ${charData.Name} \`${charData.ID}\``,
                                description: charData.Bio != "-" ? charData.Bio : "",
                                color: "#03fce8",
                            })

                            let pages = []

                            // General profile
                            let profileFields = [
                                { name: `${playerTown[charData.Town].icon} ${charData.Gender == 1 ? "♂️" : charData.Gender == 2 ? "♀️" : charData.Gender} ${playerRaces[charData.Race] != null ? playerRaces[charData.Race] : charData.Race}`, value: `${playerTribes[charData.Tribe] != null ? playerTribes[charData.Tribe] : charData.Tribe}\n${charData.Nameday}`, inline: true },
                                { name: "<:lfp:868274640076832768> World/Data Center", value: `**${charData.Server}** (${charData.DC})`, inline: true },
                                { name: "⠀", value: "⠀", inline: true },
                                { name: `${jobList[charData.ActiveClassJob.UnlockedState.ID != null ? charData.ActiveClassJob.UnlockedState.ID : 36].jobico} ${charData.ActiveClassJob.UnlockedState.Name}`, value: `**Level ${charData.ActiveClassJob.Level}**\n${intl.format(charData.ActiveClassJob.ExpLevel)} / ${intl.format(charData.ActiveClassJob.ExpLevelMax)}`, inline: true },
                            ]

                            // Grand Company
                            if (charData.GrandCompany != null) {
                                //profileFields.push({ name: "⠀", value: "⠀", inline: true })
                                profileFields.push({ name: `${playerGC[charData.GrandCompany.NameID].ico[charData.GrandCompany.RankID]} ${playerGC[charData.GrandCompany.NameID].company}`, value: `${gcTitles[charData.GrandCompany.RankID].replace("<t>", playerGC[charData.GrandCompany.NameID].title)}`, inline: true })
                            }
                            profileFields.push({ name: "Guardian", value: `${playerGuardian[charData.GuardianDeity].ico} ${playerGuardian[charData.GuardianDeity] != null ? playerGuardian[charData.GuardianDeity].name : charData.GuardianDeity}`, inline: true })
                            pages.push({ name: "Character", emoji: "🙂", fields: profileFields, image: charData.Portrait })

                            // Job/Classes
                            let tankDesc = ""
                            let healerDesc = ""
                            let meleeDesc = ""
                            let physicalDesc = ""
                            let magicalDesc = ""
                            let crafterDesc = ""
                            let gathererDesc = ""

                            charData.ClassJobs.forEach(job => {
                                let id = job.UnlockedState.ID != null ? job.UnlockedState.ID : 36 // blue mage unlock ID is null normally

                                switch (jobList[id].type) {
                                    case "tank": { tankDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "healer": { healerDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "melee": { meleeDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "physical": { physicalDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "magical": { magicalDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "crafter": { crafterDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
                                    case "gatherer": { gathererDesc += `**${jobList[id].jobico} ${jobList[id].long}** ${job.Level != 0 ? job.Level : "-"}\n`; break }
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

                            // FC
                            if (fcData != null) {
                                let fcFields = [
                                    { name: `<:group:868274639921614919> ${fcData.Name} <${fcData.Tag}>`, value: `${fcData.Slogan != "" ? `${fcData.Slogan}` : ""}` },
                                    { name: "<:lfp:868274640076832768> Server/Data Center", value: `**${fcData.Server}** (${fcData.DC})` },
                                    { name: "🎌 Free Company", value: `**Founded** ${new Date(fcData.Formed * 1000).toDateString()}\n**Active Members** ${fcData.ActiveMemberCount}\n**Active** ${fcData.Active}\n${fcData.Recruitment != "" ? `**Recruitment** ${fcData.Recruitment}\n` : ""}**Rank** ${fcData.Rank}`, inline: true },
                                ]

                                if (fcData.Estate.Name != null) {
                                    fcFields.push({ name: "⠀", value: "⠀", inline: true })
                                    fcFields.push({ name: `🏡 ${fcData.Estate.Name}`, value: `${fcData.Estate.Greeting}\n${fcData.Estate.Plot}`, inline: true })
                                }

                                pages.push({ name: "Free Company", emoji: "🎌", fields: fcFields, thumbnail: fcData.Crest[fcData.Crest.length - 1] })
                            }

                            // Eureka/Bozja
                            if (charData.ClassJobsElemental.Level != 0 && charData.ClassJobsElemental.ExpLevelMax != 0 || charData.ClassJobsBozjan.Level != null) {
                                // 🔯
                                let relicFields = []

                                if (charData.ClassJobsElemental.Level != 0 && charData.ClassJobsElemental.ExpLevelMax != 0) { relicFields.push({ name: "<:eureka:869783079210872852> The Forbidden Land, Eureka", value: `<:eurekaexp:869783079147941888> **Elemental Level** ${charData.ClassJobsElemental.Level}\n${intl.format(charData.ClassJobsElemental.ExpLevel)} / ${intl.format(charData.ClassJobsElemental.ExpLevelMax)} **EXP**` }) }
                                if (charData.ClassJobsBozjan.Level != null) { relicFields.push({ name: "<:bozja:869784982233702451> Bozjan Resistance", value: `<:mettle:869785520136396810> **Resistance Rank** ${charData.ClassJobsBozjan.Level}\n${charData.ClassJobsBozjan.Level != 25 ? `${intl.format(charData.ClassJobsBozjan.Mettle)} **Mettle**` : "**Max Mettle**"}` }) }

                                pages.push({ name: "Eureka/Bozja", emoji: "🔯", fields: relicFields })
                            }

                            pagify.pagify(baseEmbed, message, "🙂", pages)
                        }
                        catch (error) { throw error }
                        break
                    }
                }
            }
            catch (error) {
                message.channel.send(new discord.MessageEmbed({ title: "🔍 Sorry, kupo!", color: "#ff0000", description: error.message != null ? `There was a problem displaying that!\n\n${error.message}` : error }))
                if (error.message != null) console.log(error)
            }
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