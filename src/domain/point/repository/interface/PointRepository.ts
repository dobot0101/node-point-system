import { Context } from '../../../../context';
import { Point } from '../../entity/Point';

export interface PointRepository {
  findByReviewId(ctx: Context, reviewId: string): Promise<Point[]>;
  findByUserId(ctx: Context, userId: string): Promise<Point[]>;
  save(ctx: Context, ...points: Point[]): Promise<void>;
  findWithCursor(ctx: Context, pageSize: number, cursor?: string): Promise<Point[]>;
}
