import { Context } from '../context';
import { dataSource, setTypeOrmDataSource } from '../db';

export async function runTestInTransaction(ctx: Context, func: (ctx: Context) => any) {
  const ds = await dataSource.initialize();
  const qr = ds.createQueryRunner();
  await qr.startTransaction();
  setTypeOrmDataSource(ctx, qr.manager);

  await func(ctx);

  await qr.rollbackTransaction();
}
