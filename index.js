module.exports = {
  Log: require('./lib/log'),
  severity: require('./lib/severity'),
  textFormatter: require('./lib/textformatter'),
  consoleLogger: require('./lib/consolelogger'),
  streamLogger: require('./lib/streamlogger'),
  mongoLogger: require('./lib/mongologger')
}
