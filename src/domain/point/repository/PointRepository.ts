import { dataSource } from '../../../db';
import { Point } from '../entity/Point';

export class PointRepository {
  async findByReviewId(reviewId: string) {
    return await dataSource.getRepository(Point).find({
      where: {
        reviewId,
      },
    });
  }

  async findByUserId(userId: string) {
    return await dataSource.getRepository(Point).find({
      where: {
        userId,
      },
    });
  }

  async save(...points: Point[]) {
    await dataSource.getRepository(Point).save(points);
  }
}
