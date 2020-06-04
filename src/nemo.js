const fs = require('fs')
const net = require('net')

const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

// const RP = require('./rp')
const impress = require('@matianfu/impress')

module.exports = (socketPath = '/run/nemo') => {
  const server = net.createServer(conn => {
    const rpp = impress(conn)
  })

  server.on('error', err => {
    console.log('server error', err)
  })
  
  return server  
}

module.exports.Router = () => {
  return 
}
