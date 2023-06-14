import { AppDataSource } from '../db';
import { Review } from '../entities/Review';

export class ReviewRepository {
  async findByPlaceId(placeId: string) {
    return await AppDataSource.getRepository(Review).find({
      where: {
        placeId,
      },
    });
  }
}
