import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './customlogger.service';
import { LogLevel } from './interfaces/logger-config.interface';

@Global()
@Module({
  providers: [
    {
      provide: 'Logger',
      useFactory: () => {
        return new CustomLoggerService({
          level: LogLevel.DEBUG,
          directory: 'logs',
          maxFiles: 5,
          maxFileSize: 5 * 1024 * 1024,
        });
      },
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
