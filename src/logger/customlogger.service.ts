import { Injectable, LoggerService } from '@nestjs/common';
import { LoggerConfig, LogLevel } from './interfaces/logger-config.interface';
import { FileManager } from './utils/file-manager.util';
import { DEFAULT_LOGGER_CONFIG } from './constants/logger.constants';

import { LOG_COLORS, ANSI_COLORS } from './constants/logger-colors.constants';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly config: LoggerConfig;
  private readonly errorFileManager: FileManager;
  private readonly combinedFileManager: FileManager;

  constructor(
    config: Partial<LoggerConfig> = {},
    private readonly context?: string,
  ) {
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
    this.errorFileManager = new FileManager(this.config, 'error');
    this.combinedFileManager = new FileManager(this.config, 'combined');
  }
  private getTimestamp(): string {
    return new Date().toISOString();
  }
  private colorize(text: string, color: string): string {
    return `${color}${text}${ANSI_COLORS.reset}`;
  }
  private formatMessage(
    level: string,
    message: any,
    context?: string | object,
  ): string {
    const timestamp = this.getTimestamp();
    const contextInfo = context || this.context;

    // Formatear timestamp
    const coloredTimestamp = this.colorize(
      `[${timestamp}]`,
      LOG_COLORS.timestamp[level as keyof typeof LOG_COLORS.timestamp],
    );

    // Formatear nivel de log
    const coloredLevel = this.colorize(
      `[${level}]`,
      LOG_COLORS.level[level as keyof typeof LOG_COLORS.level],
    );

    // Formatear contexto si existe
    const coloredContext = contextInfo
      ? this.colorize(`[${contextInfo}]`, LOG_COLORS.context)
      : '';

    // Formatear mensaje
    const coloredMessage = this.colorize(
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message,
      LOG_COLORS.level[level as keyof typeof LOG_COLORS.level],
    );

    return `${coloredTimestamp} ${coloredLevel} ${coloredContext} ${coloredMessage}`;
  }
  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }
  private async writeToFiles(level: string, message: string, trace?: string) {
    const formattedMessage = `${message}${trace ? `\n${trace}` : ''}`;
    await this.combinedFileManager.writeLog(formattedMessage);
    if (level === 'ERROR') {
      await this.errorFileManager.writeLog(formattedMessage);
    }
  }
  async log(message: any, context?: string | object) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const formattedMessage = this.formatMessage('INFO', message, context);
    console.log(formattedMessage);
    await this.writeToFiles('INFO', formattedMessage);
  }
  async error(message: any, trace?: string, context?: string | object) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const formattedMessage = this.formatMessage('ERROR', message, context);
    console.error(formattedMessage);
    if (trace) console.error(trace);
    await this.writeToFiles('ERROR', formattedMessage, trace);
  }
  async warn(message: any, trace?: string, context?: string | object) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const formattedMessage = this.formatMessage('WARN', message, context);
    console.error(formattedMessage);
    if (trace) console.error(trace);
    await this.writeToFiles('WARN', formattedMessage, trace);
  }
  async debug(message: any, context?: string | object) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formattedMessage = this.formatMessage('DEBUG', message, context);
    console.debug(formattedMessage);
    await this.writeToFiles('DEBUG', formattedMessage);
  }
  async verbose(message: any, context?: string | object) {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formattedMessage = this.formatMessage('VERBOSE', message, context);
    console.log(formattedMessage);
    await this.writeToFiles('VERBOSE', formattedMessage);
  }
}
