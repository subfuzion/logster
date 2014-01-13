var consoleWriter = module.exports = {
  name: 'console',
  formatter: require('./textformatter'),
  write: function() {
    var args = Array.prototype.slice.call(arguments);
    console.log(consoleWriter.formatter.format.apply(null, args));
  }
};

