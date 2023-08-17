import { Context } from '../../../context';
import { getTypeOrmDataSource } from '../../../db';
import { Point } from '../entity/Point';
import { PointRepository } from './interface/PointRepository';

export class PointRepositoryImpl implements PointRepository {
  async findByReviewId(ctx: Context, reviewId: string) {
    return await getTypeOrmDataSource(ctx).getRepository(Point).find({
      where: {
        reviewId,
      },
    });
  }

  async findByUserId(ctx: Context, userId: string) {
    return await getTypeOrmDataSource(ctx).getRepository(Point).find({
      where: {
        userId,
      },
    });
  }

  async save(ctx: Context, ...points: Point[]) {
    await getTypeOrmDataSource(ctx).getRepository(Point).save(points);
  }

  async findWithCursor(ctx: Context, pageSize: number = 10, cursor?: string) {
    const queryBuilder = getTypeOrmDataSource(ctx)
      .getRepository(Point)
      .createQueryBuilder('point')
      .orderBy('point.createdAt', 'DESC')
      .addOrderBy('point.id', 'DESC')
      .take(pageSize);

    if (cursor) {
      queryBuilder.where('point.id < :cursor', { cursor });
    }

    return await queryBuilder.getMany();
  }
}
