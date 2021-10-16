const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")
const { formatEmbed, pagify } = require('../../modules/pagify')
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
        )
        .addSubcommand(sub => sub
            .setName("action")
            .setDescription("Search for an action with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the action').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("achievement")
            .setDescription("Search for an achievement with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the achievement').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("instance")
            .setDescription("Search for an instance with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the instance').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("quest")
            .setDescription("Search for a quest with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the quest').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("leve")
            .setDescription("Search for a levequest with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the leve').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("character")
            .setDescription("Search for a character with an ID")
            .addIntegerOption(option => option.setName('id').setDescription('ID of the character').setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("news")
            .setDescription("Display latest news from the Lodestone")
        ),
    async execute(interaction) {
        try {
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
                        if (received == null) throw `No results found for '${term}'`

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

                        break
                    }
                    catch (error) { throw error }
                case "item":
                    try {
                        let id = interaction.options.getInteger("id")
                        let category = interaction.options.getString("category")
                        let world = interaction.options.getString("world")

                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/item/en/3/${id}.json`)
                        if (received == null) throw `That item \`${id}\` probably doesn't exist`

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
                        break
                    }
                    catch (error) { throw error }
                case "action":
                    try {
                        let id = interaction.options.getInteger("id")
                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/action/en/2/${id}.json`)
                        if (received == null) throw `That action \`${id}\` probably doesn't exist`

                        let actionData = received.action

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

                        await interaction.reply({
                            embeds: [
                                formatEmbed(new MessageEmbed({
                                    title: `🌟 ${actionData.name} \`${actionData.id}\``,
                                    color: "#03fce8",
                                    thumbnail: { url: `https://www.garlandtools.org/files/icons/action/${actionData.icon}.png` },
                                    description: actDesc,
                                    fields: [
                                        { name: "📖 General", value: generalDesc, inline: true },
                                        { name: "✨ Ability/Spell", value: spellDesc, inline: true }
                                    ],
                                }))
                            ]
                        })
                        break
                    }
                    catch (error) { throw error }
                case "achievement":
                    try {
                        let id = interaction.options.getInteger("id")
                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/achievement/en/2/${id}.json`)
                        if (received == null) throw `That achievement \`${id}\` probably doesn't exist`
                        let achievementData = received.achievement

                        let achfields = [{ name: "💠 Points", value: achievementData.points.toString(), inline: true }]
                        if (received.partials != null) received.partials.forEach(item => achfields.push({ name: "🎁 Reward", value: `\`${item.id}\` ${item.obj.n}`, inline: true }))
                        if (achievementData.title != null) achfields.push({ name: "🔰 Title Obtained", value: achievementData.title, inline: true })

                        await interaction.reply({
                            embeds: [
                                formatEmbed(new MessageEmbed({
                                    title: `🏆 ${achievementData.name} \`${achievementData.id}\``,
                                    color: "#03fce8",
                                    thumbnail: { url: `https://garlandtools.org/files/icons/achievement/${achievementData.icon}.png` },
                                    description: achievementData.description,
                                    fields: achfields,
                                }))
                            ]
                        })
                        break
                    }
                    catch (error) { throw error }
                case "instance":
                    try {
                        let id = interaction.options.getInteger("id")

                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/instance/en/2/${id}.json`)
                        if (received == null) throw `The instance \`${id}\` probably doesn't exist`

                        let instanceData = received.instance

                        let embedFields = {}
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

                        embedFields["🏡 Instance"] = new MessageEmbed({
                            title: `🏡 ${instanceData.name}  \`${instanceData.id}\``,
                            color: "#03fce8",
                            description: parser.replacehtml(instanceData.description, htmlToReplace),
                            fields: mainFields,
                            thumbnail: { url: `https://garlandtools.org/files/icons/instance/type/${instanceData.categoryIcon}.png` },
                            image: { url: `https://garlandtools.org/files/icons/instance/${instanceData.fullIcon}.png` }
                        })

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

                            if (cofferFields.length > 0) embedFields["👑 Treasure"] = new MessageEmbed({
                                title: `🏡 ${instanceData.name}  \`${instanceData.id}\``,
                                color: "#03fce8",
                                fields: cofferFields
                            })
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

                            if (bossFields.length > 0) embedFields["👊 Bosses"] = new MessageEmbed({
                                title: `🏡 ${instanceData.name}  \`${instanceData.id}\``,
                                color: "#03fce8",
                                fields: bossFields
                            })
                        }

                        pagify(interaction, embedFields)
                    }
                    catch (error) { throw error }
                    break
                case "quest":
                    try {
                        let id = interaction.options.getInteger("id")

                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/quest/en/2/${id}.json`)
                        if (received == null) throw `That quest \`${id}\` probably doesn't exist`

                        let questData = received.quest

                        let embedFields = {}

                        let fields = [{ name: `💠 Information`, value: `**Level ${questData.reqs.jobs[0].lvl}**\n${questData.location}`, inline: true }]

                        let unlockDesc = ""
                        let rewardsDesc = ""
                        if (questData.reward != null) {
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
                            //if (rewardsDesc != "") fields.push({ name: `🎁 Rewards`, value: rewardsDesc, inline: true })
                        }

                        embedFields[questData.eventIcon == 71201 ? "🔥 Main Scenario Quest" : "🔥 Quest"] = new MessageEmbed({
                            title: `🔥 ${questData.name}  \`${questData.id}\``,
                            color: "#03fce8",
                            description: parser.replacehtml(questData.journal[0], htmlToReplace),
                            thumbnail: { url: `https://garlandtools.org/files/icons/event/${questData.eventIcon}.png` },
                            image: { url: `https://garlandtools.org/files/icons/quest/${questData.icon}.png` },
                            fields: fields,
                        })

                        if (rewardsDesc != null) {
                            embedFields["🎁 Rewards"] = new MessageEmbed({
                                title: `🔥 ${questData.name}  \`${questData.id}\``,
                                color: "#03fce8",
                                fields: [{ name: `🎁 Rewards`, value: rewardsDesc, inline: true }],
                            })
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

                        embedFields["📗 Journal"] = new MessageEmbed({
                            title: `🔥 ${questData.name}  \`${questData.id}\``,
                            color: "#03fce8",
                            description: journalFields
                        })

                        let objFields = ""
                        questData.objectives.forEach(obj => objFields += `• ${obj}\n`)

                        embedFields["🎯 Objectives"] = new MessageEmbed({
                            title: `🔥 ${questData.name}  \`${questData.id}\``,
                            color: "#03fce8",
                            description: objFields
                        })

                        pagify(interaction, embedFields)
                    }
                    catch (error) { throw error }
                    break
                case "leve":
                    try {
                        let id = interaction.options.getInteger("id")

                        let received = await parser.reqget(`https://www.garlandtools.org/db/doc/leve/en/3/${id}.json`)
                        if (received == null) throw `That levequest \`${id}\` probably doesn't exist`

                        let leveData = received.leve

                        let embedFields = {}

                        let leveFields = []
                        leveFields.push({ name: "💠 Information", value: `**${jobList[leveData.jobCategory] != null ? jobList[leveData.jobCategory].long : leveData.jobCategory} Level ${leveData.lvl}**`, inline: true })
                        if (leveData.coords != null) leveFields.push({ name: `📌 (${leveData.coords.join(", ")})`, value: "Location Name", inline: true })

                        embedFields["📑 Levequest"] = new MessageEmbed({
                            title: `📑 ${leveData.name}  \`${leveData.id}\``,
                            color: "#03fce8",
                            description: parser.replacehtml(leveData.description, htmlToReplace),
                            image: { url: `https://garlandtools.org/files/icons/leve/area/${leveData.areaicon}.png` },
                            fields: leveFields
                        })

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

                            embedFields["🎁 Potential Loot"] = new MessageEmbed({
                                title: `📑 ${leveData.name}  \`${leveData.id}\``,
                                color: "#03fce8",
                                fields: lootDesc
                            })
                        }

                        pagify(interaction, embedFields)
                    }
                    catch (error) { throw error }
                    break
                case "news":
                    let pages = {}
                    let warnings = []

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

                        pages["🔥 Topics"] = new MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                            description: "Here are the latest topics, kupo!",
                            fields: fields,
                            image: { url: received[0].image }
                        })

                        pages[`Test ${recieved[1].title}`] = new MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                            fields: { name: `1️⃣ Previous Topic (${received[1].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[1].title}](${received[1].url})**\n${received[1].description}` },
                            image: { url: received[1].image }
                        })

                        pages[`Test ${recieved[1].title}`] = new MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                            fields: { name: `2️⃣ Previous Topic (${received[2].time.replace("T", " @ ").replace(":00Z", "")})`, value: `**[${received[2].title}](${received[2].url})**\n${received[2].description}` },
                            image: { url: received[1].image }
                        })
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

                        pages["⛳ Notices"] = new MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                            fields: fields,
                        })
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

                        pages[`⚙️ Maintenance (${received[0].time.split("T")[0]})`] = new MessageEmbed({
                            title: "📰 Lodestone News",
                            color: "#03fce8",
                            fields: fields,
                        })
                    }
                    catch { warnings.push("⚙️ **Maintenance** Failed to get maintenance messages") }

                    if (pages.length == 0) throw "Could not retrieve any news"
                    else pagify(interaction, pages)

                    break
                case "character":
                    try {
                        //if (args[0] == "me") args[0] = 35425221
                        let id = interaction.options.getInteger("id")


                        let received = await parser.reqget(`https://xivapi.com/character/${id}?data=FC`)
                        if (received == null || received.Message == "Character not found on Lodestone") throw `That character ${id} probably doesn't exist, or failed to get data from Lodestone`

                        let charData = received.Character
                        let fcData = received.FreeCompany

                        let pages = {}

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

                        pages["🙂 Character"] = new MessageEmbed({
                            title: `🙂 ${fcData != null ? `<${fcData.Tag}>` : ""} ${charData.Name} \`${charData.ID}\``,
                            description: charData.Bio != "-" ? charData.Bio : "",
                            color: "#03fce8",
                            image: { url: charData.Portrait },
                            fields: profileFields,
                        })

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

                        pages["💼 Jobs"] = new MessageEmbed({
                            title: `🙂 ${fcData != null ? `<${fcData.Tag}>` : ""} ${charData.Name} \`${charData.ID}\``,
                            description: "Have you done your daily roulettes yet, kupo?",
                            color: "#03fce8",
                            fields:
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

                            pages["🎌 Free Company"] = new MessageEmbed({
                                title: `🙂 ${fcData != null ? `<${fcData.Tag}>` : ""} ${charData.Name} \`${charData.ID}\``,
                                color: "#03fce8",
                                thumbnail: { url: fcData.Crest[fcData.Crest.length - 1] },
                                fields: fcFields,
                            })
                        }

                        // Eureka/Bozja
                        if (charData.ClassJobsElemental.Level != 0 && charData.ClassJobsElemental.ExpLevelMax != 0 || charData.ClassJobsBozjan.Level != null) {
                            // 🔯
                            let relicFields = []

                            if (charData.ClassJobsElemental.Level != 0 || charData.ClassJobsElemental.ExpLevelMax != 0) { relicFields.push({ name: "<:eureka:869783079210872852> The Forbidden Land, Eureka", value: `<:eurekaexp:869783079147941888> **Elemental Level** ${charData.ClassJobsElemental.Level}\n${intl.format(charData.ClassJobsElemental.ExpLevel)} / ${intl.format(charData.ClassJobsElemental.ExpLevelMax)} **EXP**` }) }
                            if (charData.ClassJobsBozjan.Level != null) { relicFields.push({ name: "<:bozja:869784982233702451> Bozjan Resistance", value: `<:mettle:869785520136396810> **Resistance Rank** ${charData.ClassJobsBozjan.Level}\n${charData.ClassJobsBozjan.Level != 25 ? `${intl.format(charData.ClassJobsBozjan.Mettle)} **Mettle**` : "**Max Mettle**"}` }) }

                            pages["🔯 Eureka/Bozja"] = new MessageEmbed({
                                title: `🙂 ${fcData != null ? `<${fcData.Tag}>` : ""} ${charData.Name} \`${charData.ID}\``,
                                color: "#03fce8",
                                fields: relicFields,
                            })
                        }

                        pagify(interaction, pages)
                    }
                    catch (error) { throw error }
                    break
                default: await interaction.reply('Pong!')
            }
        }
        catch (error) { await interaction.reply({ embeds: [new MessageEmbed({ color: "#ff0000", description: error.message != null ? error.message : error })], ephemeral: true }) }
    },
}