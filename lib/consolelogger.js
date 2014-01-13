var consoleLogger = module.exports = {
  name: 'consolelogger',
  formatter: require('./textformatter'),
  log: function log() {
    var args = Array.prototype.slice.call(arguments);
    console.log(consoleLogger.formatter.format.apply(null, args));
  }
};

