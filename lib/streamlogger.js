var streamLogger = module.exports = {
  name: 'streamlogger',
  formatter: require('./textformatter'),
  stream: process.stdout,
  callback: null,
  log: function log() {
    try {
      var args = Array.prototype.slice.call(arguments);
      streamLogger.stream.write(streamLogger.formatter.format.apply(null, args) + '\n');
    } catch (err) {
      if (streamLogger.callback) streamLogger.callback(err);
    }
  }
}

