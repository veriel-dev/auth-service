export interface LoggerConfig {
  level: LogLevel;
  directory: string;
  maxFiles: number;
  maxFileSize: number;
}

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}
