import { randomUUID } from 'crypto';
import { Context } from '../../../context';
import { ReviewRepository } from '../../review/repository/interface/ReviewRepository';
import { CreatePointRequest } from '../dto/CreatePointRequest';
import { Point, PointSourceType, PointType } from '../entity/Point';
import { PointRepository } from '../repository/interface/PointRepository';

type CreatePointInstanceInput = {
  reviewId: string;
  userId: string;
  sourceType: PointSourceType;
};

export class PointCreateService {
  constructor(private pointRepository: PointRepository, private reviewRepository: ReviewRepository) {}

  async createPoint(ctx: Context, request: CreatePointRequest): Promise<Point[]> {
    await this.checkDuplicatePoint(ctx, request.reviewId);

    const { reviewId, userId } = request;

    const points = [];

    points.push(
      this.createPointInstance({
        reviewId,
        sourceType: PointSourceType.TEXT_REVIEW,
        userId,
      }),
    );

    // 이미지 첨부했으면 포토 리뷰 포인트 추가
    const review = await this.reviewRepository.findById(ctx, reviewId);
    if (!review) {
      throw new Error(`Review not found. reviewId: ${reviewId}`);
    }
    if (review.photos.length > 0) {
      points.push(
        this.createPointInstance({
          reviewId,
          sourceType: PointSourceType.PHOTO_REVIEW,
          userId,
        }),
      );
    }

    // 3. 해당 장소의 첫번째 리뷰이면 보너스 포인트 지급
    if (request.placeId) {
      const reviews = await this.reviewRepository.findByPlaceIdAndUserId(ctx, request.placeId, userId);
      if (reviews.length === 1) {
        points.push(
          this.createPointInstance({
            reviewId,
            sourceType: PointSourceType.PLACE_REVIEW,
            userId,
          }),
        );
      }
    }

    await this.pointRepository.save(ctx, ...points);

    return points;
  }

  private async checkDuplicatePoint(ctx: Context, reviewId: string) {
    const existingPoints = await this.pointRepository.findByReviewId(ctx, reviewId);
    if (existingPoints.length > 0) {
      throw new Error('이미 포인트가 지급되었습니다.');
    }
  }

  private createPointInstance(input: CreatePointInstanceInput) {
    return new Point({
      id: randomUUID(),
      type: PointType.ISSUANCE,
      amount: 1,
      reviewId: input.reviewId,
      sourceType: input.sourceType,
      userId: input.userId,
      createdAt: new Date(),
    });
  }
}
