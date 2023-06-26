import { DataSource, DataSourceOptions } from 'typeorm';
import { get } from '../../config/convict';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: get('typeorm.sync'),
  host: get('typeorm.host'),
  port: get('typeorm.port'),
  username: get('typeorm.username'),
  password: get('typeorm.password'),
  database: get('typeorm.database'),
  entities: [get('typeorm.entities')],
  migrations: [get('typeorm.migrations')],
  logging: get('typeorm.logging'),
};

const dataSource = new DataSource(connectionOptions);

export default dataSource;
