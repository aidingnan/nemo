const { pathToRegexp, match, parse, compile } = require("path-to-regexp")

const regexp = pathToRegexp('/test/#/:bar')

console.log(regexp)
console.log(regexp.exec('/test/#/route'))
