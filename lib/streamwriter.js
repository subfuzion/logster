var fmt = require('./textformatter').format;

var fileWriter = module.exports = {
  name: 'console',
  stream: process.stdout,
  write: function(logEntry, callback) {
    try {
      fileWriter.stream.write(fmt(logEntry) + '\n');
    } catch (err) {
      return callback(err);
    }

    return callback();
  }
}

