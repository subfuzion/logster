var fileWriter = module.exports = {
  name: 'console',
  formatter: require('./textformatter'),
  stream: process.stdout,
  callback: null,
  write: function(logEntry) {
    try {
      fileWriter.stream.write(fileWriter.formatter.format(logEntry) + '\n');
    } catch (err) {
      if (fileWriter.callback) fileWriter.callback(err);
    }
  }
}

