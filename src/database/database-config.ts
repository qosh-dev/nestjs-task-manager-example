import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOptions: DataSourceOptions = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  typename: '__typename',
  type: 'postgres',
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
