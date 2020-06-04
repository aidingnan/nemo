const EventEmitter = require('events')
const uuid = require('uuid')

/**
 * A RP Message has data or blob property, but not both.
 * data could be any JavaScript object or primitive values 
 */

class RP extends EventEmitter {
  constructor (conn) {
    super()

    this.conn = conn

    this.bufs = []
    this.message = null

    // request map: '/requests/* => ?
    this.requestMap = new Map()

    this.conn.on('data', data => this.decode(data))
  }

  // send packet
  encode (to, from, verb, eof, body) {
    let brief, data 

    if (Buffer.isBuffer(body)) {

      if (body.length === 0) throw new Error('body length must not be zero')

      data = body
      brief = {
        type: 'binary',
        length: data.length 
      }
    } else if (body !== undefined) {
      data = JSON.stringify(body)
      brief = {
        type: 'json',
        length: data.length
      }
    }

    const header = { to, from, verb, eof, body: brief } 
    this.conn.write(JSON.stringify(header))
    this.conn.write('\n')

    if (data) {
      this.conn.write(data)
      this.conn.write('\n')
    }

    return { header, body }
  }

  /**
   * Decode generate message from incoming data
   */
  decode (data) {
    while (data.length) {
      if (this.message) { // expecting body
        const len = this.bufs.reduce((sum, c) => sum + c.length, 0)

        if (len + data.length > this.message.body.length) {
          const msg = this.message
          this.message = null
          const { type, length } = msg.body

          const body = Buffer.concat([...this.bufs, data.slice(0, length - len)]) 
          this.bufs = []
          data = data.slice(length - len + 1)

          if (type === 'json') {
            msg.body = JSON.parse(body) 
          } else if (type === 'binary') {
            msg.body = body
          }

          switch (type) {
            case 'binary':
              msg.body = body
            case 'json':
              msg.body = JSON.parse(body)
            default:
              msg.body = JSON.parse(body)
          }

          this.handleMessage(msg) 
        } else {
          this.bufs.push(data)
          data = data.slice(data.length)
        }
      } else {  
        // expecting header
        let idx = data.indexOf('\n')
        if (idx === -1) {
          this.bufs.push(data.slice(0, data.length))
          data = data.slice(data.length)
        } else {
          const msg = JSON.parse(Buffer.concat([...this.bufs, data.slice(0, idx)]))
          this.bufs = []
          data = data.slice(idx + 1)
          if (msg.body) {
            this.message = msg
          } else {
            this.handleMessage(msg)
          }
        }
      }
    }
  }

  handleMessage (msg) {
    // handling response
    if (msg.to.startsWith('/requests/')) {
      const req = this.requestMap.get(msg.to)
      if (!req) return

      if (req.callback) {
        if (msg.eof) {
          // one-shot
          this.requestMap.delete(msg.to)
          if (msg.verb === 'OK') {
            req.callback(null, msg.body)
          } else {
            req.callback(Object.assign(new Error(), msg.error))
          }
        } else {
          // multiple
        }
      } else { // streaming
        if (msg.data) {
          req.stream.push(msg.data)
        } else {
        }
      }

      return
    }

    if (msg.to === '/hello' && msg.verb === 'GET') {

      const body = JSON.stringify('world')

      const rep = {
        to: msg.from,
        from: '/',
        verb: 'OK',
        eof: true,
        body: {
          type: 'json',
          length: body.length
        },
      }

      this.conn.write(JSON.stringify(rep))
      this.conn.write('\n')
      this.conn.write(body)
      this.conn.write('\n')
      return 
    }

    // handling requests
  }

  requestOneShot(to, verb, body, callback) {
    const id = uuid.v4()    
    const from = `/requests/${id}`
    const req = this.encode(to, from, 'GET', true, body)
    req.callback = callback
    this.requestMap.set(from, req)
  }

  /**
   * RP GET
   * 
   * @param 
   * @data
   */
  get (to, body, callback) {
    if (typeof body === 'function') {
      callback = body
      body = undefined
    }

    this.requestOneShot(to, 'GET', body, callback)
  } 

  /**
   *
   */
  use (path, opts, handler) {
    var offset = 0
    var path = '/'

    if (type fn !== 'function') {
      var arg = fn
    
      while (Array.isArray(arg) && arg.length !== 0) {
        arg = arg[0]
      }

      if (typeof arg !== 'function') {
        offset = 1
        path = fn
      }
    } 

    var fns = flatten(slice.call(arguments, offset))

    if (fns.length === 0) {
      throw new TypeError('app.use() requires a middleware function')
    }

    this.lazyrouter()
    var router = this._router

    fns.forEach(function (fn) {
      if (!fn || !fn.handle || !fn.set) {
        return router.use(path, fn)
      }

      fn.mountpath = path
      fn.parent = this
    }) 
  }
}

module.exports = RP
