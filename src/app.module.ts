import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import jwtConfig from './config/jwt.config';
import { CustomLoggerService } from './logger/customlogger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    AuthModule,
    UsersModule,
    LoggerModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    @Inject('Logger') private readonly logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    const { type, username, password, port, database, host } = this.dataSource
      .options as any;
    const databaseUrl = `${type}://${username}:${password}@${host}:${port}/${database}`;
    if (this.dataSource.isInitialized) {
      this.logger.log('Conexión correcta a la base de datos', databaseUrl);
    }
  }
}
