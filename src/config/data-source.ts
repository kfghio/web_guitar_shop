import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

const dataSource = new DataSource({
  ...typeOrmConfig,
  migrations: [__dirname + '/../migrations/*.ts'],
});

export default dataSource;
