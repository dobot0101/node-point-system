import { AppDataSource } from '../db';
import { Review } from '../entities/Review';

export class ReviewRepository {
  async findById(id: string) {
    return await AppDataSource.getRepository(Review).findOne({
      where: {
        id,
      },
    });
  }
  async findByPlaceIdAndUserId(placeId: string, userId: string) {
    return await AppDataSource.getRepository(Review).find({
      where: {
        placeId,
        userId,
      },
    });
  }
}
