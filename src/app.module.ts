import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    UsersModule,
    AuthModule,
    SeedsModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    const { type, username, password, port, database, host } = this.dataSource
      .options as any;
    const databaseUrl = `${type}://${username}:${password}@${host}:${port}/${database}`;
    console.log('¿Base de datos conectada?:', this.dataSource.isInitialized);
    const entities = this.dataSource.entityMetadatas;
    console.log(
      'Entidades:',
      entities.map((entity) => entity.name),
    );

    if (this.dataSource.isInitialized) {
      this.logger.log('Conexión correcta a la base de datos', databaseUrl);
    }
  }
}
