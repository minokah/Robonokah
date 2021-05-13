const Discord = require('discord.js')

const garlandtools = require("garlandtools-api")

function returnError(input, error) {
    let embed = new Discord.MessageEmbed()
        .setTitle(input)
        .setColor("#FF0000")
        .setDescription(error)
        .setTimestamp()

    return embed
}

async function garlandItemID(id) {
    let embed = null

    try {
        let result = await garlandtools.item(id)
        let item = result["item"]

        embed = new Discord.MessageEmbed()
            .setTitle("📦 " + item["name"])
            .setColor("#ffff00")
            .setDescription(item["description"])
            .setThumbnail("http://garlandtools.org/files/icons/item/" + item["icon"] + ".png")
            .setTimestamp()
            .setURL("https://ffxiv.consolegameswiki.com/wiki/" + item["name"].split(" ").join("_"))

        switch (item["category"]) {
            case 5: // Weapons
                embed.addFields({ // items
                    name: "Item Level " + item["ilvl"],
                    value: item["jobCategories"] + "\nLv. " + item["elvl"]
                })
                embed.addFields({
                    name: "Value",
                    value: "Sells for " + item["price"] + " gil\n"
                })
                break
            case 46: // Food
                embed.addFields({ // items
                    name: "This is a " + item["name"] + ".",
                    value: "It's edible!\n(More information soon...)"
                })
                embed.addFields({
                    name: "Value",
                    value: "Sells for " + item["sell_price"] + " gil\n"
                })
                break
            default: // Not added yet
                embed.addFields({ // items
                    name: "Not added yet, dumping to console",
                    value: "..."
                })
                console.log(result)
                break
        }
    }
    catch (error) {
        if (error != "") error += "\n\n"
        embed = returnError("📦 " + id, error + "Invalid item ID!\n**Usage**: ^xiv item id")
    }

    return embed
}

async function garlandAchievementID(id) {
    let embed = null

    try {
        let result = await garlandtools.achievement(id)
        let achievement = result["achievement"]

        //console.log(result)

        embed = new Discord.MessageEmbed()
            .setTitle("🏆 " + achievement["name"])
            .setColor("#ffff00")
            .setDescription(achievement["description"])
            .setThumbnail("http://garlandtools.org/files/icons/achievement/" + achievement["icon"] + ".png")
            .setTimestamp()
            .setURL("https://ffxiv.consolegameswiki.com/wiki/" + achievement["name"].split(" ").join("_"))
            .addFields({ // items
                name: "Achievement Points",
                value: achievement["points"]
            })

        switch (achievement["category"]) {
            case 12: // General
                embed.addFields({ // items
                    name: "Title Obtained",
                    value: achievement["title"]
                })
                break
            case 18: // Gold Saucer
                embed.addFields({ // items
                    name: "Title Awarded",
                    value: achievement["title"]
                })
                break
            default: // Not added yet
                embed.addFields({ // items
                    name: "Not added yet, dumping to console",
                    value: "..."
                })
                console.log(result)
                break
        }

        //console.log(embed)
    }
    catch (error) {
        if (error != "") error += "\n\n"
        embed = returnError("🏆 " + id, error + "Invalid achievement ID!\n**Usage**: ^xiv achievement id")
    }

    return embed
}

async function garlandSearch(input) { // input is: term [type,page]
    let embed = null

    try {
        if (input.length <= 0) throw ""

        if (!isNaN(input)) throw "It appears you're trying to search for an ID.\nUse ^xiv type id instead." //embed = garlandID(input[0]) // defaults to searching id if first term a number
        else {
            // defaults to page 1 of "item"
            let page = 1
            let type = null

            let params = input[input.length - 1] // parameters
            if (params[0] == '[' && params[params.length - 1] == ']') { // page are specified
                params = params.replace('[', '')
                params = params.replace(']', '')

                input.pop()
                params = params.split(",")
                console.log(params)

                if (params.length > 1) { // both type and page, only first two parameters are counted
                    if (isNaN(params[0])) type = params[0]
                    else throw "Type must be a string!"

                    if (!isNaN(params[1])) page = (parseInt(params[1]) > 0) ? parseInt(params[1]) : 1 // 0th page does not exist (and below it)
                    else throw "Page must be an integer!"
                }
                else {
                    if (isNaN(params[0])) type = params[0]
                    else page = (parseInt(params[0]) > 0) ? parseInt(params[0]) : 1
                }
            }

            let term = input.join(" ")
            let retrieved = await garlandtools.search(term)

            if (retrieved.length <= 0) throw "No results found!"

            let retrievedCopy = [] // TIL js references objects instead of copying them
            for (let i = 0; i != retrieved.length; i++) { retrievedCopy[i] = retrieved[i] }

            let entriesArray = []

            let totalResults = retrieved.length
            let groups = Math.ceil(totalResults / 10)
            for (let i = 0; i != groups; i++) { // split all results into groups of 10
                let group = []

                for (let v = 0; v != 10; v++) {
                    if (retrievedCopy.length > 0) {
                        let entry = retrievedCopy.shift()
                        if (entry["type"] == type || type == null) group[group.length] = entry // add to entry list if id matches
                    }
                }

                entriesArray[i] = group
            }

            if (page > groups) throw "Only " + groups + " page(s) are available."

            let sendStr = ""

            let entryPage = entriesArray[page - 1]

            for (let i = 0; i != entryPage.length; i++) {
                sendStr += "[" + entryPage[i]["type"] + ", " + entryPage[i]["id"] + "] " + entryPage[i]["obj"]["n"]
                if (i + 1 != entryPage.length) sendStr += '\n'
            }

            embed = new Discord.MessageEmbed()
                .setTitle(term)
                .setColor("#ffff00")
                .setThumbnail("http://garlandtools.org/files/icons/" + entryPage[0]["type"] + "/" + entryPage[0]["obj"]["c"] + ".png")
                .setDescription("Showing items " + ((page - 1) * 10) + " - " + (((page - 1) * 10) + entryPage.length) + " out of " + totalResults + " total results"
                    + "\nFilter: " + ((type != null) ? type : "none")
                    + "\nPage " + page + " of " + groups)
                .setTimestamp()
                .addFields({
                    name: "[Type, ID] Name",
                    value: sendStr
                })
        }
    }
    catch (error) {
        if (error != "") error += "\n\n"
        embed = returnError("🔎 " + input.join(" "), error + "Your syntax or search terms may be incorrect.\n**Usage**: .xiv search term [type | page | type,page]")
    }

    return embed
}

module.exports = {
    name: 'xiv',
    description: 'Search for stuff from FINAL FANTASY XIV',
    execute(message, args) {

        if (args.length > 0) {
            let command = args.shift()

            switch (command) { // combine copy paste
                case "search":
                    if (args == "" || args == null || args == undefined) {
                        message.channel.send(returnError("🔎 search", "Add in a search term to get results.\n**Usage**: ^xiv search term [type | page | type,page]"))
                    }
                    else {
                        garlandSearch(args).then(function (toast) {
                            if (toast != null) message.channel.send(toast);
                            else message.channel.send(returnError(args, "Toast returned null!"))
                        })
                    }
                    break
                case "item":
                    if (args == "" || args == null || args == undefined) {
                        message.channel.send(returnError("📦 item", "Add in an ID to get results.\n**Usage**: ^xiv item id"))
                    }
                    else {
                        garlandItemID(args).then(function (toast) {
                            if (toast != null) message.channel.send(toast);
                            else message.channel.send(returnError(args, "Toast returned null!"))
                        })
                    }
                    break
                case "achievement":
                    if (args == "" || args == null || args == undefined) {
                        message.channel.send(returnError("🏆 achievement", "Add in an ID to get results.\n**Usage**: ^xiv achievement id"))
                    }
                    else {
                        garlandAchievementID(args).then(function (toast) {
                            if (toast != null) message.channel.send(toast);
                            else message.channel.send(returnError(args, "Toast returned null!"))
                        })
                    }
                    break
                default:
                    message.channel.send(returnError("❓ " + command, "Not a valid command.\nCheck the commands list for commands: ^xiv"))
            }
        }
        else {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle("FFXIV Search")
                    .setColor("#ffff00")
                    .setDescription("Search for items and more (soon) from the crtically acclaimed MMORPG")
                    .setThumbnail("https://www.clipartkey.com/mpngs/m/59-594682_final-fantasy-xiv-ffxiv-dark-knight-logo.png")
                    .addFields({
                        name: "Commands",
                        value: "🔎 **^xiv search term [type | page | type,page]** - Search for an item"
                            + "\n📦 **^xiv item id** - Get item details using the ID"
                            + "\n🏆 **^xiv achievement id** - Get achievement details using the ID"
                            + "\n❓ **^xiv [help]** - Pull up this commands list"
                            + "\n\nValues in [square brackets] are optional\nThe | symbol means any of the options"
                    })
                    .setTimestamp()
            )
        }
    },
};