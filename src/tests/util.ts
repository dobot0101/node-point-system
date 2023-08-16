import { Context } from '../context';
import { initTypeOrmDataSource, setTypeOrmDataSource } from '../db';

export async function runTestInTransaction(ctx: Context, func: (ctx: Context) => any) {
  const ds = await initTypeOrmDataSource();
  const qr = ds.createQueryRunner();
  await qr.startTransaction();
  setTypeOrmDataSource(ctx, qr.manager);

  await func(ctx);

  await qr.rollbackTransaction();
}
