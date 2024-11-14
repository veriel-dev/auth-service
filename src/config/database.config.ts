/* eslint-disable @typescript-eslint/ban-ts-comment */
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export default registerAs('database', (): DataSourceOptions => {
  const config = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  };

  // Imprimir la configuración de forma segura (ocultando la contraseña)
  console.log('\n🔶 Database Configuration:');
  console.log('------------------------');
  console.log('📍 Host:', config.host);
  console.log('🔢 Port:', config.port);
  console.log('👤 Username:', config.username);
  console.log('🔑 Password:', config.password);
  console.log('📂 Database:', config.database);
  console.log('🔄 Synchronize:', config.synchronize);
  console.log('📝 Logging:', config.logging);
  console.log('📚 Entities:', config.entities);
  console.log('🔄 Migrations:', config.migrations);
  console.log('------------------------\n');

  // Validación básica
  const requiredEnvVars = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
  };

  const missingVars = Object.entries(requiredEnvVars)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    console.error(missingVars.join(', '));
    console.error('\nMake sure these variables are set in your .env file');
    throw new Error('Missing required database configuration variables');
  }

  // Validar que el puerto es un número válido
  if (isNaN(config.port)) {
    throw new Error('DATABASE_PORT must be a valid number');
  }
  //@ts-expect-error
  return config;
});
