var fmt = require('./textformatter').format;

var fileWriter = module.exports = {
  name: 'console',
  stream: process.stdout,
  callback: null,
  write: function(logEntry) {
    try {
      fileWriter.stream.write(fmt(logEntry) + '\n');
    } catch (err) {
      if (fileWriter.callback) fileWriter.callback(err);
    }
  }
}

