import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Place } from './domain/place/entity/Place';
import { Point } from './domain/point/entity/Point';
import { Review } from './domain/review/entity/Review';
import { ReviewPhoto } from './domain/review/entity/ReviewPhoto';
import { User } from './domain/user/entity/User';

export const dataSource = new DataSource({
  // type: 'mysql',
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: '28828bb8ec779fc98b63a323bcb644f49023af728bc84f7800f4e9',
  database: 'postgres',
  // entities: [__dirname + '/../dist/domain/**/entity/*.{js,ts}'],
  entities: [Place, User, Review, ReviewPhoto, Point],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
