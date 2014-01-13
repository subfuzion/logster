var fmt = require('util').format;

module.exports = {
  name: 'textformatter',
  format: function(logEntry) {
    var template = logEntry.category
      ? '[%s] %s (%s) %s'
      : '[%s] %s %s';

    var args = [ template ];
    args.push(logEntry.timestamp);
    args.push(logEntry.level);
    if (logEntry.category) args.push(logEntry.category);
    args.push(logEntry.message);

    var s = fmt.apply(null, args);

    args = Array.prototype.slice.call(arguments, 1);
    if (args.length > 0) {
      var extra = { data: args };
      s = fmt('%s', s, extra);
    }

    return s;
  }
};

