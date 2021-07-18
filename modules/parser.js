module.exports = {
    /* 
        parse parameters
        -   takes in something like "[string:Hello World,integer:5,table:{}]" and makes it into
        {
            "string": "Hello World",
            "integer": 5,
            "table": {}
        }
    */
    parseparams(args) {
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
    },

    /* 
        replacehtml
        -   replaces html tags in a string
    */
    replacehtml(str, tuples, all = false) {
        tuples.forEach(arr => str = str.replace(arr[0], (arr[1] != null) ? arr[1] : ""))
        if (all) str = str.replace(/(<([^>]+)>)/g, "") // replace all html tags afterwards
        return str
    }
}