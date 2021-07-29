let https = require("https")
let http = require("http")

module.exports = {
    /* 
        Parse parameters
        -   Takes in something like "[string:Hello World,integer:5,table:"{}"]" and makes it into
        {
            "string": "Hello World",
            "integer": "5",
            "table": "{}"
        }

        Yes, the integer and table are strings but you can convert them using parseInt() and JSON.parse() respectively
    */
    parseparams(args, lower = true) {
        let paramList = {}

        args.forEach((arg, i) => {
            if (arg[0] == "[" && arg[arg.length - 1] == "]") {
                args.splice(i, 1)
                arg = arg.replace("[", "").replace("]", "")
                arg = arg.split(",")
                for (let v = 0; v != arg.length; v++) {
                    if (arg[v] != "") {
                        let value = arg[v].split(":")
                        if (lower) paramList[value[0].toLowerCase()] = (value[1] != null) ? value[1].toLowerCase() : null
                        else paramList[value[0]] = value[1]
                    }
                }
            }
        })

        return paramList
    },

    /* 
        ReplaceHTML
        -   Replaces html tags in a string
        -   Tuples are what x will be replaced by y ["replaceMe", "withThis"]
        -   all just removes the rest of the html tags all together
    */
    replacehtml(str, tuples, all = false) {
        tuples.forEach(arr => str = str.replace(arr[0], (arr[1] != null) ? arr[1] : ""))
        if (all) str = str.replace(/(<([^>]+)>)/g, "") // replace all html tags afterwards
        return str
    },

    /*
        reqget
        - async/await get thing
    */
    reqget(url) {
        let type = null
        if (url.startsWith("https")) type = https
        else if (url.startsWith("http")) type = http

        return new Promise(resolve => {
            type.get(url, response => {
                let recieved = ""
                response.on("data", data => recieved += data)
                response.on("end", () => {
                    try { resolve(JSON.parse(recieved)) }
                    catch { resolve(null) }
                })
            })
        })
    }
}