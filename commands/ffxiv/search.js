const Discord = require('discord.js')
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI({
    private_key: "key-here",
    language: "en"
});

// todo: move into an array instead
var previousArray = null
var previousTerm = null
var previousSize = null
var previousType = null

function returnError(input, error) {
    var embed = new Discord.MessageEmbed()
        .setTitle(input)
        .setColor("#FF0000")
        .setDescription(error)
        .setFooter("FFXIV Search")
        .setTimestamp()

    return embed
}

async function searchID(type, id) {
    var embed = null

    try {
        type = type.toLowerCase()
        var result = await xiv.data.get(type, id)
        console.log(result)

        if (type == "item") {
            embed = new Discord.MessageEmbed()
                .setTitle(result["Name"])
                .setColor(0x00AE86)
                .setDescription(result["Description"])
                .setFooter("FFXIV Search")
                .setThumbnail("https://xivapi.com" + result["IconHD"])
                .setTimestamp()
                .setURL("https://ffxiv.consolegameswiki.com/wiki/" + result["Name"].replace(" ", "_"))
                .addFields({
                    name: "Value",
                    value: "Sale Price: " + result["PriceMid"] + " gil\n"
                        + "Sells for " + result["PriceLow"] + " gil"
                })
                .addFields({ // items
                    name: "Item Level " + result["LevelItem"],
                    value: result["ClassJobCategory"]["Name"] + "\n"
                        + "Lv. " + result["LevelEquip"]
                })
        }
        else if (type == "recipe") {
            embed = new Discord.MessageEmbed()
                .setTitle(result["Name"])
                .setColor(0x00AE86)
                .setDescription(result["ItemResult"]["Description"])
                .setFooter("FFXIV Search")
                .setThumbnail("https://xivapi.com" + result["ItemResult"]["IconHD"])
                .setTimestamp()
                .setURL("https://ffxiv.consolegameswiki.com/wiki/" + result["Name"].replace(" ", "_"))
                .addFields({
                    name: "Value",
                    value: "Sale Price: " + result["ItemResult"]["PriceMid"] + " gil\n"
                        + "Sells for " + result["ItemResult"]["PriceLow"] + " gil"
                })
                .addFields({ // literally everything else
                    name: "This is a " + result["Name"] + ".",
                    value: "There's... really nothing else here."
                })
        }
    }
    catch (error) {
        embed = returnError(id, "Invalid item ID!\n\nIf you're searching for anything other than 'item', the format is: .xiv search [type] id")
    }

    return embed
}

async function doSearch(input) { // input is: [type,page] term
    var embed = null

    try {
        if (input.length <= 0) throw ""

        if (!isNaN(input)) {
            previousArray = null
            previousSize = null
            previousType = null
            previousTerm = null
            embed = searchID("item", input[0]) // defaults to searching id if first term a number
        }
        else {
            // defaults to page 1 of "item"
            var page = 1
            var type = "item"

            var params = input[0]
            if (params[0] == '[' && params[params.length - 1] == ']') { // params are specified
                params = params.replace('[', '')
                params = params.replace(']', '')

                params = params.split(",")

                if (params.length > 1) { // both [type,page]
                    if (isNaN(params[0])) type = params[0]
                    else throw "Type must be a string."

                    if (!isNaN(params[1])) page = parseInt(params[1])
                    else throw "Page must be an integer. Sorry, words as numbers won't work here."
                    if (page == 0) throw "There is no such thing as a 0th page."
                }
                else if (params.length == 1) { // just [type] or [page]
                    if (isNaN(input[0])) type = params[0]
                    else page = parseInt(params[0])
                }
                else throw "If you're gonna have brackets, put something in them."

                previousType = type
                input.shift()
            }

            var term = input.join(" ")

            if (previousTerm == null) previousTerm = term // set previous search term as new one if it is null or different
            if (previousType == null) previousType = type // and type
            if (previousTerm != term || previousType != type || previousArray == null) { // generate new results if term is different than last, trying to reduce api calls here
                previousArray = []

                var result = (await xiv.search(term, { indexes: type }))["Results"]

                if (result.length <= 0) throw "No results found!"

                previousSize = result.length

                for (var i = 0; i != Math.ceil(previousSize / 10); i++) { // split all results into groups of 10
                    var group = []
                    for (var v = 0; v != 10; v++) {
                        if (result.length > 0) group[v] = result.shift()
                    }
                    previousArray[i] = group
                }
            }

            if (previousSize > 1) {
                if (page > previousArray.length) throw "Only " + previousArray.length + " page(s) are available."

                var sendStr = ""

                var arrayResult = previousArray[page - 1]
                for (var i = 0; i != arrayResult.length; i++) {
                    sendStr += arrayResult[i]["ID"] + " : " + arrayResult[i]["Name"]
                    if (i + 1 != arrayResult.length) sendStr += '\n'
                }

                embed = new Discord.MessageEmbed()
                    .setTitle(term)
                    .setColor(0x00AE86)
                    .setThumbnail("https://xivapi.com" + arrayResult[0]["IconHD"])
                    .setDescription("Showing items " + ((page - 1) * 10) + " - " + (((page - 1) * 10) + previousArray[page - 1].length) + " out of " + previousSize + " total results\nSearching for '" + previousType + "'(s)\nPage " + page + " of " + Math.ceil(previousSize / 10))
                    .setFooter("FFXIV Search")
                    .setTimestamp()
                    .addFields({
                        name: "ID : Name",
                        value: sendStr
                    })
            }
            else {
                console.log(previousArray[0][0]["UrlType"] + " - " + previousArray[0][0]["ID"])
                embed = searchID(previousArray[0][0]["UrlType"], previousArray[0][0]["ID"])
            }
        }
    }
    catch (error) {
        if (error != "") error += "\n\n"
        embed = returnError(previousTerm, error + "Your syntax or search terms may be incorrect.\nFormat: .xiv search [type,page] term")
    }

    return embed
}

module.exports = {
    name: 'xiv',
    description: 'FFXIV Item Search',
    execute(message, args) {
        if (args[0] == "search") {
            args.shift()
            var input = args

            if (input == "" || input == null || input == undefined) {
                message.channel.send(returnError("search", "Usage: .xiv search [type,page] term\n\nParameters can be [type], [page], or [type,page]"))
            }
            else {
                doSearch(input).then(function (toast) {
                    if (toast != null) message.channel.send(toast);
                    else message.channel.send(returnError(input, "Someting went wrong!"))
                })
            }
        }
    },
};