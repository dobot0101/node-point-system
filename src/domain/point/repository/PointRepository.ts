import { Context } from '../../../context';
import { getTypeOrmDataSource } from '../../../db';
import { Point } from '../entity/Point';

export class PointRepository {
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
}
