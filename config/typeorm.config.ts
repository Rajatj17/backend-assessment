import { DataSource } from 'typeorm';
import { applicationConfig } from './index';

export default new DataSource({
  type: 'postgres',
  host: applicationConfig.db.host,
  port: applicationConfig.db.port,
  username: applicationConfig.db.user,
  password: applicationConfig.db.password,
  database: applicationConfig.db.dbName,
  entities: ['src/**/**/*.entity.{js,ts}'],
  migrations: ['migrations/*{.ts,.js}'],
});
