declare enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
declare class Logger {
  private level;
  private prefix;
  setLevel(level: LogLevel): void;
  setPrefix(prefix: string): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
export declare const logger: Logger;
export { LogLevel };
//# sourceMappingURL=logger.d.ts.map
