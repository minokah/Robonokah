/* 
    p(aram)parser

    yeah

    takes in something like "[string:Hello World,integer:5,table:{}]" and makes it into

    {
        "string": "Hello World",
        "integer": 5,
        "table": {}
    }

*/

module.exports = {
    parse(args) {
        let paramList = {}

        args.forEach((arg, i) => {
            if (arg[0] == "[" && arg[arg.length - 1] == "]") {
                args.splice(i, 1)
                arg = arg.replace("[", "").replace("]", "")
                arg = arg.split(",")
                for (let v = 0; v != arg.length; v++) {
                    let value = arg[v].split(":")
                    paramList[value[0]] = value[1]
                }
            }
        })

        return paramList
    }
}