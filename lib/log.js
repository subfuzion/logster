var severity = require('./severity')
  , util = require('util')
  , async = require('async')
  ;


var Log = exports = module.exports = function Log(level) {
  if (typeof level == 'string') level = severity[level.toUpperCase()];
  if (typeof level != 'number' || level < severity.EMERGENCY || level > severity.DEBUG) {
    level = severity.NONE;
  }

  this.level = level;
  this.enabled = level !== severity.NONE;

  this.writers = [];
  var writers = Array.prototype.splice.call(arguments, 1);
  for (var i = 0; i < writers.length; i++) {
    this.addWriter(writers[i]);
  }
};

Log.prototype.addWriter = function addWriter(writer) {
  if (writer && typeof writer.name == 'string' && typeof writer.write == 'function') {
    this.writers.push(writer);
  }

  // for chaining writers
  return this;
}

Log.prototype.removeWriter = function removeWriter(name) {
  for (var i = this.writers.length - 1; i >= 0; i--) {
    if (this.writers[i].name === name) {
      this.writers.splice(i, 1);
      return;
    }
  }
}

Log.prototype.write = function write(classification, message, callback) {
  if (this.writers.length == 0) return console.trace('the log does not have any writers');

  // callback might actually be the start of extra args
  // but the last arg should ALWAYS be the actual callback
  var cb = arguments[arguments.length-1];

  if (!cb || typeof cb != 'function') {
    // must provide a callback because of the requirement to
    // support async writers (such as the mongowriter)
    return console.trace('log was called without a callback');
  }

  if (!message) {
    console.trace('log was called without a message');
    return cb(new Error('log was called without a message'));
  }

  var extraArgsStart = 2
    , extraArgsEnd = arguments.length - 1
    , extraArgs
    ;

  var level = classification.level;
  var category = classification.category || 'default';

  // validate the severity
  if (typeof level == 'string') {
    level = severity[level.toUpperCase()];
  }

  var sevCode = level;
  var sevName;

  try {
    sevName = severity.str(sevCode);
  } catch (err) {
    return cb(err);
  }

  if (level > this.level) {
    return cb(null);
  }

  var logEntry = {
    timestamp: new Date,
    category: category,
    level: sevName,
    levelCode: sevCode,
    message: message
  }

  if (extraArgsEnd - extraArgsStart) {
    extraArgs = Array.prototype.slice.call(arguments, extraArgsStart, extraArgsEnd);
    logEntry.data = extraArgs;
  }

  // if not enabled, won't write, but will still callback with the logEntry
  if (this.enabled) {
//    for (var i = 0; i < this.writers.length; i++) {
//      this.writers[i].write(logEntry);
//    }

    async.each(
      this.writers,
      function(writer, callback) { writer.write(logEntry, callback) },
      function(err) {
        if (err) return cb(err);
        return cb(null, logEntry);
      }
    );
  }
}

Log.prototype.emergency = function emergency(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  if (typeof classification.category == 'string') {
    args[0].level = severity.EMERGENCY;
  } else {
    args.splice(0, 0, { level: severity.EMERGENCY });
  }

  this.write.apply(this, args);
}


