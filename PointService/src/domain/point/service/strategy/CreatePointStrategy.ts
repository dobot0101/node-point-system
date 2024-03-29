import { randomUUID } from 'crypto';
import { Context } from '../../../../context';
import { AwsClient } from '../../../aws/AwsClient';
import { ReviewRepository } from '../../../review/repository/interface/ReviewRepository';
import { PointRequest } from '../../dto/PointRequest';
import { Point, PointSourceType, PointType } from '../../entity/Point';
import { PointRepository } from '../../repository/interface/PointRepository';
import { PointServiceStrategy } from './PointServiceStrategy';

export class CreatePointStrategy implements PointServiceStrategy {
  constructor(
    private pointRepository: PointRepository,
    private reviewRepository: ReviewRepository,
    private awsClient: AwsClient,
  ) {}
  async execute(ctx: Context, request: PointRequest) {
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

    const messageBodys = points.map((point) => JSON.stringify(point));
    const responses = await this.awsClient.sendBulkSqsMessage(messageBodys);
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

type CreatePointInstanceInput = {
  reviewId: string;
  userId: string;
  sourceType: PointSourceType;
};
