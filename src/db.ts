import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSource = new DataSource({
  // type: 'mysql',
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: '28828bb8ec779fc98b63a323bcb644f49023af728bc84f7800f4e9',
  database: 'postgres',
  // entities: [__dirname + '/../dist/domain/**/entity/*.{js,ts}'],
  entities: ['dist/domain/**/entity/*.{js,ts}'],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
