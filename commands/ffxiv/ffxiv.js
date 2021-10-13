const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")
const { pagify } = require('../../modules/pagify')
const { categoryList, jobList, lovType, retainerCities, achievementCategories, playerRaces, playerTribes, playerGuardian, playerTown, playerGC, gcTitles, htmlToReplace, intl } = require("../ffxiv/data.js")
const parser = require("../../modules/parser")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('xiv')
        .setDescription('Search stuff from Final Fantasy XIV')
        .addSubcommand(sub => sub
            .setName("ad")
            .setDescription("Have you heard of the critically acclaimed MMORPG, Final Fantasy XIV?")
        )
        .addSubcommand(sub => sub
            .setName("map")
            .setDescription("Display an image of a location's map")
            .addStringOption(option => option.setName('name').setDescription('Enter a location name (ex. La Noscea/Lower Na Loscea)').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("search")
            .setDescription("Search for something")
            .addStringOption(option => option.setName('name').setDescription('Name of the item').setRequired(true))
            .addStringOption(option => option.setName('type').setDescription('Filter by item type'))
        )
        .addSubcommand(sub => sub
            .setName("item")
            .setDescription("Search for an item with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the item').setRequired(true))
            .addStringOption(option => option.setName('category').setDescription('Skip to a category (crafting, effects, marketboard)'))
            .addStringOption(option => option.setName('world').setDescription('Data Center or World for Market Board data'))
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "ad":
                interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            title: "✨ Have you heard of Final Fantasy XIV?",
                            description: "If you haven't, you're in luck! Final Fantasy XIV is the critically acclaimed MMORPG by Square Enix which includes a **free trial, the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60 with no restrictions on playtime!**",
                            color: "#00a8ff",
                            url: "https://freetrial.finalfantasyxiv.com/gb/",
                            fields: [
                                { name: "Why should I?", value: "Catgirls, and you probably don't have anything better to do in your spare time. Do I need to say more?", inline: true },
                                { name: "Features Include", value: "`200+ Hour Story Across 3 Expansions`\n`Character Customization`\n`One Character for All Classes/Jobs`\n`Many Dungeons and Raids`\n`Free Companies/Guilds`\nAnd more!", inline: true },
                            ],
                        })
                    ]
                })
                break
            case "map":
                let map = interaction.options.getString("name")
                let url = map.replace(/\s/g, "%20")
                await interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            title: "🗺️ " + map.replace(/\//g, " > "),
                            color: "#00a8ff",
                            image: { url: `https://www.garlandtools.org/files/maps/${url}.png` },
                            footer: { text: "No image? Your input may not be a real location" }
                        })
                    ]
                })
                break
            case "search":
                try {
                    let term = interaction.options.getString("name")
                    let parsedType = interaction.options.getString("type")
                    let received = await parser.reqget(`https://www.garlandtools.org/api/search.php?text=${term}&lang=en`)

                    let results = []

                    received.forEach(entry => {
                        if (entry.type == parsedType || parsedType == null) results.push(entry)
                    })
                    if (results.length <= 0) {
                        await interaction.reply({
                            ephemeral: true,
                            embeds: [new MessageEmbed({ color: "#ff0000", description: `No results for '${term}' found` })]
                        })
                        break
                    }
                    /*
                    else if (results.length == 1) {
                        // reconstruct params string after parsed
                        Object.keys(params).forEach(key => args.push(`${key}:${params[key]},`))
                        args[args.length - 1] = `[${args[args.length - 1]}]`
                        args.unshift(results[0].id)
                        args.unshift(results[0].type)
                        this.execute(message, args)
                    }
                    */
                    else {
                        let pages = []
                        while (results.length) { pages.push(results.splice(0, 10)) }

                        let descArray = []
                        pages.forEach(page => {
                            let listingDesc = ""
                            page.forEach(entry => listingDesc += `\`${entry.type} ${entry.id}\` ${entry.obj.n}\n`)
                            descArray.push(listingDesc)
                        })

                        let pageFields = {}

                        for (let i = 0; i != pages.length; i++) {
                            console.log(String(i + 1))
                            pageFields[String(i + 1)] = new MessageEmbed({
                                title: `🔍 ${term}`,
                                color: "#00a8ff",
                                description: "Use `/xiv item` to get more info about a result",
                                fields: [
                                    { name: "📌 Filter", value: `**Page** ${i + 1}\n${(parsedType != null ? `Showing only \`${parsedType}\`` : "Showing all types")}` },
                                    { name: "📋 Results", value: descArray[i] }
                                ],
                                thumbnail: { url: `https://garlandtools.org/files/icons/${pages[i][0].type}/${pages[i][0].obj.c}.png` }
                            })
                        }

                        pagify(interaction, pageFields)
                    }
                }
                catch (error) {
                    console.log(error)
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed({ color: "#ff0000", description: `Failed to search for item: ${error}` })]
                    })
                    break
                }
                break
            case "item":
                try {
                    let id = interaction.options.getInteger("id")
                    let category = interaction.options.getString("category")
                    let world = interaction.options.getString("world")

                    let received = await parser.reqget(`https://www.garlandtools.org/db/doc/item/en/3/${id}.json`)
                    if (received == null) throw "That item probably doesn't exist"

                    let itemData = received.item

                    let embedProperties = {
                        emoji: "📦",
                        slotCategory: (categoryList[itemData.category] != null) ? categoryList[itemData.category].name : itemData.category,
                    }

                    // todo: setup embed/switch for individual jobs/objects (CUL, waist gear, job arms) then add in "grouped" stuff after (ex title, attr, crafts)
                    // or make half the stuff the default case

                    let statFields = [
                        { name: "📖 General", value: `**Item Level** ${itemData.ilvl}\n${(itemData.sell_price) ? `**Sells for** ${itemData.sell_price} gil` : "**Unsellable**"}` }
                    ]

                    let embedFields = {}

                    let page = "💪 Stats"
                    // Swap to any page with shorthand in parameters ^xiv item id [mb] for marketboard
                    if (category == "c" || category == "crafting") if (itemData.craft != null) page = "🛠️ Crafting"
                    if (category == "e" || category == "effects") if (itemData.attr != null && itemData.attr.action != null) page = "🌟 Effects"
                    if (category == "mb" || category == "marketboard") if (itemData.tradeable != null) page = "🚀 Market Board"

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

                    embedFields["💪 Stats"] = new MessageEmbed({
                        title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                        color: "#03fce8",
                        fields: statFields,
                        description: (itemData.description) ? parser.replacehtml(itemData.description, htmlToReplace, true) : "*No description*",
                        thumbnail: { url: `https://garlandtools.org/files/icons/item/${itemData.icon}.png` }
                    })

                    if (lovFields.length > 0) {
                        embedFields["🧸 Lord of Verminion"] = new MessageEmbed({
                            title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                            color: "#03fce8",
                            fields: lovFields,
                            description: itemData.tooltip.replace(/\r\n/g, " "),
                            thumbnail: { url: `https://garlandtools.org/files/icons/item/${itemData.icon}.png` }
                        })
                    }
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

                        embedFields["🛠️ Crafting"] = new MessageEmbed({
                            title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                            color: "#03fce8",
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

                        embedFields["🌟 Effects"] = new MessageEmbed({
                            title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                            color: "#03fce8",
                            fields: { name: "🌟 Effects", value: attrDesc, inline: true }
                        })
                    }

                    // Market board data
                    if (itemData.tradeable != null && itemData.unlistable == null) {
                        let server = "crystal" // crystal gang
                        if (world != null) server = world

                        let marketReceived = await parser.reqget(`https://universalis.app/api/${server}/${itemData.id}`)
                        if (marketReceived == null) {
                            //message.channel.send(new discord.MessageEmbed({ title: "📦 Item Lookup", color: "#ffff00", description: "🚀 **Market Board** No data found, the World/DC you entered may not be real, kupo!" }))
                            embedFields["🚀 Market Board"] = new MessageEmbed({
                                title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                                color: "#03fce8",
                                description: "No data found, the World/DC you entered may not be real, kupo!",
                            })

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

                            embedFields["🚀 Market Board"] = new MessageEmbed({
                                title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                                color: "#03fce8",
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

                        embedFields["🃏 Triple Triad"] = new MessageEmbed({
                            title: `${embedProperties.emoji} ${itemData.name}  \`${itemData.id}\``,
                            color: "#03fce8",
                            fields: [
                                { name: `<:triad:870469313717481493> ${itemData.name.split("Card")[0]}`, value: `${stars}\n${itemData.tripletriad.en.description}`, inline: true },
                                { name: "⚖️ Sides", value: `⠀⠀${parser.emojiNumber(itemData.tripletriad.top)}\n${parser.emojiNumber(itemData.tripletriad.left)}⠀⠀${parser.emojiNumber(itemData.tripletriad.right)}\n⠀⠀${parser.emojiNumber(itemData.tripletriad.bottom)}`, inline: true },
                                { name: "⠀", value: "⠀", inline: true },
                                { name: "💪 General", value: `${itemData.tripletriad.sellMgp != null ? `**Sells for** ${itemData.tripletriad.sellMgp} MGP` : "**Unsellable**"}` },
                            ],
                            thumbnail: { url: `https://garlandtools.org/files/icons/triad/plate/${itemData.tripletriad.plate}.png` }
                        })
                    }

                    pagify(interaction, embedFields, page)
                }
                catch (error) {
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed({ color: "#ff0000", description: `Failed to pull up item data` })]
                    })
                    break
                }
                break
            default: await interaction.reply('Pong!')
        }
    },
}