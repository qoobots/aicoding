/**
 * 日志工具
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private prefix: string = '[AI-Coding-Platform]';

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  debug(...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`${this.prefix} DEBUG:`, ...args);
    }
  }

  info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`${this.prefix} INFO:`, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`${this.prefix} WARN:`, ...args);
    }
  }

  error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`${this.prefix} ERROR:`, ...args);
    }
  }
}

export const logger = new Logger();
export { LogLevel };
