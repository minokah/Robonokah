let discord = require("discord.js")

let userEmojis = {
    "455903710212784128": "🦊"
}

let runningGame = null

module.exports = {
    name: "ttt",
    execute(message, args) {
        if (args.length > 0) {
            let command = args.shift()

            if (!userEmojis[message.author.id]) userEmojis[message.author.id] = "❌" // default

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
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, userEmojis[message.author.id]),
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
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, userEmojis["455903710212784128"]),
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
                        if (args.length < 1) throw "Ⓜ️ You must specify an emoji"

                        let emoji = args[0]
                        userEmojis[message.author.id] = emoji

                        message.channel.send(new discord.MessageEmbed({
                            author: {
                                name: emoji + " " + message.author.tag,
                                iconURL: message.author.avatarURL()
                            },
                            description: "Your emoji has been updated!",
                            color: "#03fce8",
                        }))
                        break
                    default:
                        if (runningGame == null) throw "🎲 No game is currently running"
                        let spot = parseInt(command) - 1
                        let selection = runningGame[spot]
                        if (spot + 1 < 1 || spot + 1 > 9) throw "🎲 Invalid selection, must be 1-9"
                        if (selection == "⭕" || selection == userEmojis[message.author.id]) throw "🎲 That spot has already been taken!"

                        runningGame[spot] = userEmojis[message.author.id]

                        let botWin = false
                        let playerWin = false

                        // row
                        if (runningGame[0] == runningGame[1] && runningGame[0] == runningGame[2] && runningGame[1] == userEmojis[message.author.id]
                            || runningGame[3] == runningGame[4] && runningGame[3] == runningGame[5] && runningGame[3] == userEmojis[message.author.id]
                            || runningGame[6] == runningGame[7] && runningGame[6] == runningGame[8] && runningGame[6] == userEmojis[message.author.id]) playerWin = true

                        // cross
                        if (runningGame[0] == runningGame[3] && runningGame[0] == runningGame[6] && runningGame[0] == userEmojis[message.author.id]
                            || runningGame[1] == runningGame[4] && runningGame[1] == runningGame[7] && runningGame[1] == userEmojis[message.author.id]
                            || runningGame[2] == runningGame[5] && runningGame[2] == runningGame[8] && runningGame[2] == userEmojis[message.author.id]) playerWin = true

                        // diagonal
                        if (runningGame[0] == runningGame[4] && runningGame[0] == runningGame[8] && runningGame[0] == userEmojis[message.author.id]
                            || runningGame[2] == runningGame[4] && runningGame[2] == runningGame[6] && runningGame[2] == userEmojis[message.author.id]) playerWin = true

                        // move to separate array to make it faster lol
                        while (true) { // bot move
                            if (playerWin) break
                            let randomNum = Math.floor(Math.random() * 9)
                            let botMove = runningGame[randomNum]
                            if (botMove == "⭕" || botMove == userEmojis[message.author.id]) continue

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
                            if (runningGame[i] == "⭕" || runningGame[i] == userEmojis[message.author.id]) count += 1
                        }


                        let embed = new discord.MessageEmbed({
                            title: "Tic-Tac-Toe",
                            description: ("❌ **" + message.author.tag + "** ⚔️ **Robonokah#4118** ⭕").replace(/❌/g, userEmojis[message.author.id]),
                            color: "#03fce8",
                        })

                        let kill = false
                        if (botWin || playerWin || count == 9) {
                            if (botWin) embed.setAuthor("⭕ Robonokah#4118", "https://i.imgur.com/osYUUmY.png")
                            else if (playerWin) embed.setAuthor(userEmojis[message.author.id] + " " + message.author.tag + " claims victory!", message.author.avatarURL())
                            else embed.setAuthor("🤷 Nobody wins, you're both losers!")
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
                            "\n`Ⓜ️ eset (emoji)` Set your own custom emoji marker"
                    }
                ]
            }))
        }
    }
}