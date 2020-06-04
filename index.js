const NM = require('./src/nm')

const nm = new NM() 

nm.on('ready', () => nm.requestScan())
