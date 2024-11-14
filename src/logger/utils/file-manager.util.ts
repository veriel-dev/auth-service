import * as fs from 'fs';
import * as path from 'path';
import { LoggerConfig } from '../interfaces/logger-config.interface';

export class FileManager {
  private currentFileSize: number = 0;
  private currentFileIndex: number = 0;
  constructor(
    private readonly config: LoggerConfig,
    private readonly logType: string,
  ) {
    this.initializeLogDirectory();
  }

  private initializeLogDirectory(): void {
    if (!fs.existsSync(this.config.directory)) {
      fs.mkdirSync(this.config.directory, { recursive: true });
    }
  }
  private getLogFilePath(index: number): string {
    return path.join(this.config.directory, `${this.logType}-${index}.log`);
  }
  private rotateFiles(): void {
    this.currentFileIndex = (this.currentFileIndex + 1) % this.config.maxFiles;
    this.currentFileSize = 0;

    const filePath = this.getLogFilePath(this.currentFileIndex);

    if (fs.existsSync(filePath)) {
      fs.truncateSync(filePath);
    }
  }
  async writeLog(message: string): Promise<void> {
    const filePath = this.getLogFilePath(this.currentFileIndex);
    if (this.currentFileSize >= this.config.maxFileSize) {
      this.rotateFiles();
    }

    const logEntry = `${message}\n`;
    await fs.promises.appendFile(filePath, logEntry);
    this.currentFileSize += Buffer.byteLength(logEntry);
  }
}
