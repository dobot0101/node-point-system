import { Context } from '../../../context';
import { getTypeOrmDataSource } from '../../../db';
import { Review } from '../entity/Review';

// typeorm 공식 문서에서 안내하는 custom repository 만드는 방법
// export const reviewRepository = dataSource.getRepository(Review).extend({
//   async findByPlaceIdAndUserId(placeId: string, userId: string) {
//     return await this.findBy({
//       placeId,
//       userId,
//     });
//   },
// });

export class ReviewRepository {
  async findById(ctx: Context, id: string) {
    return await getTypeOrmDataSource(ctx).getRepository(Review).findOne({
      where: {
        id,
      },
    });
  }

  async findByPlaceIdAndUserId(ctx: Context, placeId: string, userId: string) {
    return await getTypeOrmDataSource(ctx).getRepository(Review).find({
      where: {
        placeId,
        userId,
      },
    });
  }
}
