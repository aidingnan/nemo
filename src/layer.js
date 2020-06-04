// this file is a brute copy from express.js, which is MIT licensed

class Layer {
  constructor (path, options, fn) {
      
    this.handle = fn
    this.params = undefined
    this.path = undefined  
    this.regexp = pathRegexp(path, this.keys = [], opts)
    this.regexp.fast_star = path === '*'
    this.regexp.fast_slash = path === '/' && opts.end === false
  }

  handle_error (err, req, res, next) {
  }

  handle_request (req, res, next) {
  }

  match (path) {
    let match

    if (path !== null) {
      if (this.regexp.fast_slash) {
        this.params = {}
        this.path = ''
        return true
      }

      if (this.regexp.fast_star) {
        this.params = {'0': decode_param(path)}
        this.path = path
        return true
      }

      match = this.regexp.exec(path)
    }

    if (!match) {
      this.params = undefined
      this.path = undefined
      return false
    }

    this.params = {}
    this.path = match[0]

    var keys = this.keys
    var params = this.params
  
    for (var i = 1; i < match.length; i++) {
      var key = keys[i - 1]
      var prop = key.name
      var val = decode_param(match[i])

      if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
        params[prop] = val
      }
    }

    return true
  }
}

module.exports = Layer
