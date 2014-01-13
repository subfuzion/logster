var fileWriter = module.exports = {
  name: 'console',
  formatter: require('./textformatter'),
  stream: process.stdout,
  callback: null,
  write: function() {
    try {
      var args = Array.prototype.slice.call(arguments);
      fileWriter.stream.write(fileWriter.formatter.format.apply(null, args) + '\n');
    } catch (err) {
      if (fileWriter.callback) fileWriter.callback(err);
    }
  }
}

