var fmt = require('./textformatter').format;

module.exports = {
  name: 'console',
  write: function(logEntry) {
    console.log(fmt(logEntry));
  }
};

