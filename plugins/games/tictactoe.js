let discord = require("discord.js")

let userEmojis = {}
let profiles = {}
let runningGame = null

function getIcon(user) {
    let profile = userEmojis[user.id]
    if (profile == null) return "❌"
    if (profile.discord) return `:${profile.icon}:`
    else return profile.icon
}

module.exports = {
    name: "ttt",
    startup(client) {
        this.client = client
        client.writeConfig("ttt", "userEmojis", null, {})
        userEmojis = this.config.userEmojis
        profiles = this.config.profiles
    },
    execute(message, args) {
        if (args.length > 0) {
            let command = args.shift()

            try {
                switch (command) {
                    case "play":
                        runningGame = {}
                        runningGame[0] = "1️⃣"
                        runningGame[1] = "2️⃣"
                        runningGame[2] = "3️⃣"
                        runningGame[3] = "4️⃣"
                        runningGame[4] = "5️⃣"
                        runningGame[5] = "6️⃣"
                        runningGame[6] = "7️⃣"
                        runningGame[7] = "8️⃣"
                        runningGame[8] = "9️⃣"


                        if (Math.floor(Math.random() * 2) == 0) {
                            runningGame[Math.floor(Math.random() * 9)] = "⭕" // random move for bot initially
                        }

                        message.channel.send(new discord.MessageEmbed({
                            title: "Tic-Tac-Toe",
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, getIcon(message.author)),
                            color: "#03fce8",
                        }))

                        let board = ""
                        for (let i = 0; i != 9; i++) {
                            board += runningGame[i]
                            if ((i + 1) % 3 == 0) board += "\n"
                        }

                        message.channel.send(board)
                        break
                    case "test":
                        message.channel.send(new discord.MessageEmbed({
                            title: "Tic-Tac-Toe",
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, userEmojis["455903710212784128"].icon),
                            color: "#03fce8",
                        }))
                        message.channel.send("⭕❌⭕\n4️⃣❌6️⃣\n7️⃣8️⃣❌".replace(/❌/g, userEmojis["455903710212784128"])).then(board => {
                            /*
                            board.react("1️⃣")
                            board.react("2️⃣")
                            board.react("3️⃣")
                            board.react("4️⃣")
                            board.react("5️⃣")
                            board.react("6️⃣")
                            board.react("7️⃣")
                            board.react("8️⃣")
                            board.react("9️⃣")
                            */
                        })
                        break
                    case "eset":
                        if (args.length < 1) {
                            message.channel.send(new discord.MessageEmbed({
                                author: { name: getIcon(message.author) + " " + message.author.tag, iconURL: message.author.avatarURL() },
                                description: `Your current emoji is ${getIcon(message.author)}`,
                                color: "#03fce8",
                            }))
                            break
                        }

                        let emoji = args[0]
                        let useDiscord = (args[1] == "true") ? true : false // use discord version of emoji instead (ex. canada flag, CA -> flag_ca)
                        userEmojis[message.author.id] = { icon: emoji, discord: useDiscord }
                        this.client.writeConfig("ttt", "userEmojis", userEmojis)

                        message.channel.send(new discord.MessageEmbed({
                            author: { name: getIcon(message.author) + " " + message.author.tag, iconURL: message.author.avatarURL() },
                            description: "Your emoji has been updated!",
                            color: "#03fce8",
                        }))
                        break
                    case "me": {
                        message.channel.send(new discord.MessageEmbed({
                            title: `${getIcon(message.author)} ${message.author.tag}`,
                            thumbnail: { url: message.author.avatarURL() },
                            description: "Custom description goes here",
                            color: "#03fce8",
                            fields: [{name: "🏆 Win - Loss", value: profiles[message.author.id] != null ? `**${profiles[message.author.id].win}** - ${profiles[message.author.id].loss}` : "No Data"}]
                        }))
                        break
                    }
                    default:
                        if (runningGame == null) throw "🎲 No game is currently running"
                        let spot = parseInt(command) - 1
                        let selection = runningGame[spot]
                        if (spot + 1 < 1 || spot + 1 > 9) throw "🎲 Invalid selection, must be 1-9"
                        if (selection == "⭕" || selection == getIcon(message.author)) throw "🎲 That spot has already been taken!"

                        runningGame[spot] = getIcon(message.author)

                        let botWin = false
                        let playerWin = false

                        // row
                        if (runningGame[0] == runningGame[1] && runningGame[0] == runningGame[2] && runningGame[1] == getIcon(message.author)
                            || runningGame[3] == runningGame[4] && runningGame[3] == runningGame[5] && runningGame[3] == getIcon(message.author)
                            || runningGame[6] == runningGame[7] && runningGame[6] == runningGame[8] && runningGame[6] == getIcon(message.author)) playerWin = true

                        // cross
                        if (runningGame[0] == runningGame[3] && runningGame[0] == runningGame[6] && runningGame[0] == getIcon(message.author)
                            || runningGame[1] == runningGame[4] && runningGame[1] == runningGame[7] && runningGame[1] == getIcon(message.author)
                            || runningGame[2] == runningGame[5] && runningGame[2] == runningGame[8] && runningGame[2] == getIcon(message.author)) playerWin = true

                        // diagonal
                        if (runningGame[0] == runningGame[4] && runningGame[0] == runningGame[8] && runningGame[0] == getIcon(message.author)
                            || runningGame[2] == runningGame[4] && runningGame[2] == runningGame[6] && runningGame[2] == getIcon(message.author)) playerWin = true

                        // move to separate array to make it faster lol
                        while (true) { // bot move
                            if (playerWin) break
                            let randomNum = Math.floor(Math.random() * 9)
                            let botMove = runningGame[randomNum]
                            if (botMove == "⭕" || botMove == getIcon(message.author)) continue

                            runningGame[randomNum] = "⭕"
                            break
                        }

                        // todo: clean bad matrix stuff here
                        // row
                        if (runningGame[0] == runningGame[1] && runningGame[0] == runningGame[2] && runningGame[1] == "⭕"
                            || runningGame[3] == runningGame[4] && runningGame[3] == runningGame[5] && runningGame[3] == "⭕"
                            || runningGame[6] == runningGame[7] && runningGame[6] == runningGame[8] && runningGame[6] == "⭕") botWin = true

                        // cross
                        if (runningGame[0] == runningGame[3] && runningGame[0] == runningGame[6] && runningGame[0] == "⭕"
                            || runningGame[1] == runningGame[4] && runningGame[1] == runningGame[7] && runningGame[1] == "⭕"
                            || runningGame[2] == runningGame[5] && runningGame[2] == runningGame[8] && runningGame[2] == "⭕") botWin = true

                        // diagonal
                        if (runningGame[0] == runningGame[4] && runningGame[0] == runningGame[8] && runningGame[0] == "⭕"
                            || runningGame[2] == runningGame[4] && runningGame[2] == runningGame[6] && runningGame[2] == "⭕") botWin = true

                        let count = 0
                        for (let i = 0; i != 9; i++) {
                            if (runningGame[i] == "⭕" || runningGame[i] == getIcon(message.author)) count += 1
                        }


                        let embed = new discord.MessageEmbed({
                            title: "Tic-Tac-Toe",
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, getIcon(message.author)),
                            color: "#03fce8",
                        })

                        let kill = false
                        if (botWin || playerWin || count == 9) {
                            profiles[message.author.id] = { win: profiles[message.author.id] != null ? profiles[message.author.id].win : 0, loss: profiles[message.author.id] != null ? profiles[message.author.id].loss : 0 }
                            if (botWin) {
                                embed.setAuthor("⭕ Robonokah#4118 claims victory!", "https://i.imgur.com/osYUUmY.png")
                                profiles[message.author.id].loss = profiles[message.author.id].loss + 1
                            }
                            else if (playerWin) {
                                embed.setAuthor(getIcon(message.author) + " " + message.author.tag + " claims victory!", message.author.avatarURL())
                                profiles[message.author.id].win = profiles[message.author.id].win + 1
                            }
                            else embed.setAuthor("🤷 Nobody wins, you're both losers!")
                            this.client.writeConfig("ttt", "profiles", profiles)
                            kill = true
                        }

                        message.channel.send(embed)

                        let b = ""
                        for (let i = 0; i != 9; i++) {
                            b += runningGame[i]
                            if ((i + 1) % 3 == 0) b += "\n"
                        }
                        message.channel.send(b)
                        if (kill) runningGame = null

                        break
                }
            }
            catch (error) { message.channel.send("❌ " + error) }
        }
        else {
            message.channel.send(new discord.MessageEmbed({
                title: "🎲 Tic-Tac-Toe",
                description: "Play tic-tac-toe against another player or Robonokah!",
                color: "#03fce8",
                thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/41yg3KWfkQL.png" },
                fields: [
                    {
                        name: "Commands",
                        value: "`🎲 play` Play tic-tac-toe against Robonokah" +
                            "\n`Ⓜ️ eset (emoji) [discordtoggle]` Set your own custom emoji marker" +
                            "\n`🧑 me\` View own player card"
                    }
                ]
            }))
        }
    }
}