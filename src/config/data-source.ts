import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};

console.log('\n🔶 Database Configuration: data-source.ts');
console.log('------------------------');
console.log('📍 Host:', config.host);
console.log('🔢 Port:', config.port);
console.log('👤 Username:', config.username);
console.log('🔑 Password:', config.password ? '********' : 'Not set');
console.log('📂 Database:', config.database);
console.log('🔄 Synchronize:', config.synchronize);
console.log('📝 Logging:', config.logging);
console.log('📚 Entities:', config.entities);
console.log('🔄 Migrations:', config.migrations);
console.log('------------------------\n');

export const AppDataSource = new DataSource(config as any);
