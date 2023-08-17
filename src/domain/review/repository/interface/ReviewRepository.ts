import { Context } from '../../../../context';
import { Review } from '../../entity/Review';

export interface ReviewRepository {
  findById(ctx: Context, id: string): Promise<Review | null>;
  findByPlaceIdAndUserId(ctx: Context, placeId: string, userId: string): Promise<Review[]>;
}
