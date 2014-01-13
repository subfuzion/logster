var consoleWriter = module.exports = {
  name: 'console',
  formatter: require('./textformatter'),
  write: function(logEntry) {
    console.log(consoleWriter.formatter.format(logEntry));
  }
};

