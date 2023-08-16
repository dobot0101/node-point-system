import { DataSource, EntityManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Context } from './context';
import { Place } from './domain/place/entity/Place';
import { Point } from './domain/point/entity/Point';
import { Review } from './domain/review/entity/Review';
import { ReviewPhoto } from './domain/review/entity/ReviewPhoto';
import { User } from './domain/user/entity/User';

export const dataSource = new DataSource({
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

const dataSourceMap = new Map<Context, DataSource | EntityManager>();
const transactionMap = new Map<Context, EntityManager>();

export function getTypeOrmDataSource(ctx: Context) {
  const dataSource = dataSourceMap.get(ctx);
  if (!dataSource) {
    throw new Error(`TypeORM connection not found`);
  }

  return transactionMap.get(ctx) || dataSource;
}

export async function withTransaction(ctx: Context, callback: (ctx: Context) => {}) {
  const ds = dataSourceMap.get(ctx);
  if (!ds) {
    throw new Error(`datasource not found`);
  }

  if (transactionMap.has(ctx)) {
    return await callback(ctx);
  }

  await ds.transaction(async (em) => {
    transactionMap.set(ctx, em);
    try {
      await callback(ctx);
    } catch (error) {
      throw error;
    } finally {
      transactionMap.delete(ctx);
    }
  });
}

export function setTypeOrmDataSource(ctx: Context, dataSource: DataSource | EntityManager) {
  dataSourceMap.set(ctx, dataSource);
}

export async function initTypeOrmDataSource() {
  return await dataSource.initialize();
}
