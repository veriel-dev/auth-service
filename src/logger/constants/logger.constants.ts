import { LoggerConfig, LogLevel } from '../interfaces/logger-config.interface';

export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  directory: 'logs',
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024,
};
