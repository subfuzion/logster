// same as syslog severity levels
// http://en.wikipedia.org/wiki/Syslog#Severity_levels

module.exports = {
  NONE: -1,
  EMERGENCY: 0,
  ALERT: 1,
  CRITICAL: 2,
  ERROR: 3,
  WARNING: 4,
  NOTICE: 5,
  INFO: 6,
  DEBUG: 7,

  str: function(val) {
    if (typeof val != 'number') throw new Error('not a valid severity value (must be a number)');

    switch (val) {
      case -1: return 'NONE';
      case 0: return 'EMERGENCY';
      case 1: return 'ALERT';
      case 2: return 'CRITICAL';
      case 3: return 'ERROR';
      case 4: return 'WARNING';
      case 5: return 'NOTICE';
      case 6: return 'INFO';
      case 7: return 'DEBUG';
    }

    throw new Error('not a valid severity value (out of range)');
  }
};
