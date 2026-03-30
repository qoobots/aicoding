'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LogLevel = exports.logger = void 0;
var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel['DEBUG'] = 0)] = 'DEBUG';
  LogLevel[(LogLevel['INFO'] = 1)] = 'INFO';
  LogLevel[(LogLevel['WARN'] = 2)] = 'WARN';
  LogLevel[(LogLevel['ERROR'] = 3)] = 'ERROR';
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
  constructor() {
    this.level = LogLevel.INFO;
    this.prefix = '[AI-Coding-Platform]';
  }
  setLevel(level) {
    this.level = level;
  }
  setPrefix(prefix) {
    this.prefix = prefix;
  }
  debug(...args) {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`${this.prefix} DEBUG:`, ...args);
    }
  }
  info(...args) {
    if (this.level <= LogLevel.INFO) {
      console.log(`${this.prefix} INFO:`, ...args);
    }
  }
  warn(...args) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`${this.prefix} WARN:`, ...args);
    }
  }
  error(...args) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`${this.prefix} ERROR:`, ...args);
    }
  }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map
