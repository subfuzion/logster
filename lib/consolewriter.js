var fmt = require('./textformatter').format;

module.exports = {
  name: 'console',
  write: function(logEntry, callback) {
    console.log(fmt(logEntry));
    return callback();
  }
};

