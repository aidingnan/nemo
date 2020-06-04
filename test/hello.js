const path = require('path')
const fs = require('fs')
const net = require('net')

const uuid = require('uuid')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const expect = require('chai').expect

const impress = require('@matianfu/impress')
const nemo = require('src/nemo')

describe(path.basename(__filename), () => {

  beforeEach(done => rimraf('/run/nemo', done))

  it('socket should be removed if server properly closed', done => {
    const app = nemo() 
    app.listen('/run/nemo')
    setTimeout(() => {
      app.close()
      fs.stat('/run/nemo', (err, stats) => {
        expect(err.code).to.equal('ENOENT')
        done()
      })
    }, 10)
  })

  it('GET hello', done => {
    const app = nemo()
    app.listen('/run/nemo')

    const client = net.createConnection('/run/nemo', () => {
      const rpp = impress(client)
      rpp.get('/hello', (err, data) => {
        expect(err).to.equal(null)
        expect(data).to.equal('world')
        done()
      })
    })
  })

  it('POST hello should fail', done => {
    const app = nemo()
    app.listen('/run/nemo')

    const client = net.createConnection('/run/nemo', () => {
      const rp = new RP(client)
      rp.post('/hello', (err, data) => {
        console.log(err, data)
        done()
      })
    })
  })
})


