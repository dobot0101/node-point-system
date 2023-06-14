import { AppDataSource } from '../db';
import { Point } from '../entities/Point';

export class PointRepository {
  async findByReviewId(reviewId: string) {
    return await AppDataSource.getRepository(Point).find({
      where: {
        sourceId: reviewId,
      },
    });
  }

  async getBySourceTypeAndSourceId(sourceType: string, sourceId: string) {
    return await AppDataSource.getRepository(Point).findOne({
      where: {
        sourceType,
        sourceId,
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
