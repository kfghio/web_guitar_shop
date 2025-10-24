import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const config = parse(process.env.DATABASE_URL);

if (!config.host || !config.user || !config.password || !config.database) {
  throw new Error('Неверная конфигурация базы данных');
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.host,
  port: parseInt(config.port || '5432', 10),
  username: config.user,
  password: config.password,
  database: config.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};
