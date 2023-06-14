import { DataSource } from 'typeorm';

console.log(__dirname);
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'point',
  entities: [__dirname + '/../dist/entities/*.{js,ts}'],
  synchronize: true,
  logging: true,
});
