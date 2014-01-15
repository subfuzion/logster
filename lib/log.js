var severity = require('./severity')
  , async = require('async')
  , _ = require('underscore')
  , placeHolders = /%s|%d|%j/g
  ;


var Log = exports = module.exports = function Log(level) {
  if (typeof level == 'string') level = severity[level.toUpperCase()];
  if (typeof level != 'number' || level < severity.EMERGENCY || level > severity.DEBUG) {
    level = severity.NONE;
  }

  this.level = level;
  this.enabled = level !== severity.NONE;

  this.loggers = [];
  var loggers = Array.prototype.splice.call(arguments, 1);
  for (var i = 0; i < loggers.length; i++) {
    this.addLogger(loggers[i]);
  }

  this.defaultCategory = '';

  this.data = null;
  this.tags = null;
};

Log.prototype.addLogger = function addLogger(logger) {
  if (logger && typeof logger.name == 'string' && typeof logger.log == 'function') {
    this.loggers.push(logger);
  }

  // for chaining loggers
  return this;
}

Log.prototype.removeLogger = function removeLogger(name) {
  for (var i = this.loggers.length - 1; i >= 0; i--) {
    if (this.loggers[i].name === name) {
      this.loggers.splice(i, 1);
      return;
    }
  }
}

Log.prototype.write = function write(classification, message, callback) {
  if (this.loggers.length == 0) return console.trace('the log does not have any loggers');

  // callback might actually be the start of extra args
  // but the last arg should ALWAYS be the actual callback
  var cb = function(err, logEntry) { /* no-op */ };
  if (typeof arguments[arguments.length-1] == 'function') {
    cb = arguments[arguments.length-1];
  }

  if (!message) {
    console.trace('log was called without a message');
    return cb(new Error('log was called without a message'));
  }

  var extraArgsStart = 2
    , extraArgsEnd = (typeof arguments[arguments.length-1] == 'function') ? arguments.length - 1 : arguments.length
    , extraArgs
    ;

  var matches = message.match(placeHolders);
  var nPlaceHolders = 0;
  if (matches) {
    nPlaceHolders = matches.length;
    console.log('matches: ' + nPlaceHolders);

    var fmtArgs = Array.prototype.slice.call(arguments, extraArgsStart-1, extraArgsStart + nPlaceHolders);
    message = require('util').format.apply(null, fmtArgs);

    extraArgsStart += nPlaceHolders;
  }

  var level = classification.level;
  var category = classification.category || this.defaultCategory || '';

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

  if (this.data) {
    logEntry.data = logEntry.data || {};
    logEntry.data = _.extend(logEntry.data, this.data);
  }

  if (this.tags) {
    logEntry.tags = logEntry.tags || [];
    logEntry.tags = _.union(logEntry.tags, this.tags);
  }

  if (extraArgsEnd - extraArgsStart) {
    logEntry.data = logEntry.data || {};
    extraArgs = Array.prototype.slice.call(arguments, extraArgsStart, extraArgsEnd);
    _.each(extraArgs, function(element, index, list) {
      if (typeof element == 'object') {
        _.extend(logEntry.data, element);
      } else if (element && typeof element != 'function') {
        logEntry.tags = logEntry.tags || [];
        logEntry.tags.push(element);
      }
    });
    //logEntry.data = extraArgs;
  }

  // if not enabled, won't write, but will still callback with the logEntry
  if (this.enabled) {
    /*
    for (var i = 0; i < this.loggers.length; i++) {
      this.loggers[i].log(logEntry);
    }
    */

    async.each(
      this.loggers,
      function(logger, callback) { logger.log(logEntry, extraArgs, cb) },
      function(err) {
        if (err) return cb(err);
        return cb(null, logEntry);
      }
    );
  }
}

Log.prototype.drain = function drain(callback) {
  async.each(
    this.loggers,
    function(logger, callback) {
      if (typeof logger.drain == 'function') {
        logger.drain(callback)
      }
    },
    function() {
      return callback();
    }
  );
}

Log.prototype._write = function _write(level, classification, message, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof classification.category == 'string') {
    args[0].level = level;
  } else {
    args.splice(0, 0, { level: level });
  }

  this.write.apply(this, args);
}

Log.prototype.emergency = function emergency(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.EMERGENCY);
  this._write.apply(this, args);
}


Log.prototype.alert = function alert(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.ALERT);
  this._write.apply(this, args);
}

Log.prototype.critical = function critical(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.CRITICAL);
  this._write.apply(this, args);
}

Log.prototype.error = function error(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.ERROR);
  this._write.apply(this, args);
}

Log.prototype.warning = function warning(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.WARNING);
  this._write.apply(this, args);
}

Log.prototype.notice = function notice(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.NOTICE);
  this._write.apply(this, args);
}

Log.prototype.info = function info(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.INFO);
  this._write.apply(this, args);
}

Log.prototype.debug = function debug(classification, message, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(severity.DEBUG);
  this._write.apply(this, args);
}

