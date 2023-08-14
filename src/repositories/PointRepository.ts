import { AppDataSource } from '../db';
import { Point } from '../entities/Point';

export class PointRepository {
  async findByReviewId(reviewId: string) {
    return await AppDataSource.getRepository(Point).find({
      where: {
        reviewId,
      },
    });
  }

  async findByUserId(userId: string) {
    return await AppDataSource.getRepository(Point).find({
      where: {
        userId,
      },
    });
  }

  async save(...points: Point[]) {
    await AppDataSource.getRepository(Point).save(points);
  }
}
