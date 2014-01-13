module.exports = {
  Log: require('./lib/log.js').Log,
  severity: require('./lib/severity'),
  textFormatter: require('./lib/textformatter'),
  consoleWriter: require('./lib/consolewriter'),
  streamWriter: require('./lib/streamwriter'),
  mongoWriter: require('./lib/mongowriter')
}
