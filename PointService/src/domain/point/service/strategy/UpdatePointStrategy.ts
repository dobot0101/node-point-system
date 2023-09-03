import { randomUUID } from 'crypto';
import { Context } from '../../../../context';
import { ReviewRepository } from '../../../review/repository/interface/ReviewRepository';
import { PointRequest } from '../../dto/PointRequest';
import { Point, PointSourceType, PointType } from '../../entity/Point';
import { PointRepository } from '../../repository/interface/PointRepository';
import { PointServiceStrategy } from './PointServiceStrategy';
import { AwsClient } from '../../../aws/AwsClient';

export class UpdatePointStrategy implements PointServiceStrategy {
  constructor(
    private pointRepository: PointRepository,
    private reviewRepository: ReviewRepository,
    private awsClient: AwsClient,
  ) {}

  async execute(ctx: Context, req: PointRequest) {
    const reviewPoints = await this.pointRepository.findByReviewId(ctx, req.reviewId);
    if (reviewPoints.length === 0) {
      throw new Error(`리뷰 포인트가 존재하지 않습니다. reviewId: ${req.reviewId}`);
    }

    const userPoints = await this.pointRepository.findByUserId(ctx, req.userId);
    if (userPoints.length === 0) {
      throw new Error(`유저 포인트가 존재하지 않습니다.`);
    }

    const review = await this.reviewRepository.findById(ctx, req.reviewId);
    if (!review) {
      throw new Error(`리뷰가 존재하지 않습니다.`);
    }

    const pointsToSave = [];

    let totalRemainingPoints = userPoints.reduce(
      (acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount),
      0,
    );

    const photoReviewPoint = reviewPoints.find((point) => point.sourceType === PointSourceType.PHOTO_REVIEW);
    const placeReviewPoint = reviewPoints.find((point) => point.sourceType === PointSourceType.PLACE_REVIEW);

    // 포토 리뷰가 추가됐으면 포인트 지급
    if (review.photos.length > 0 && !photoReviewPoint) {
      pointsToSave.push(
        new Point({
          id: randomUUID(),
          amount: 1,
          reviewId: req.reviewId,
          sourceType: PointSourceType.PHOTO_REVIEW,
          type: PointType.ISSUANCE,
          userId: req.userId,
          createdAt: new Date(),
        }),
      );
    } else if (review.photos.length === 0 && photoReviewPoint) {
      // 포토 리뷰가 삭제됐으면 포인트 차감
      if (totalRemainingPoints >= 1) {
        pointsToSave.push(
          new Point({
            id: randomUUID(),
            amount: 1,
            reviewId: req.reviewId,
            sourceType: PointSourceType.PHOTO_REVIEW,
            type: PointType.SPENDING,
            userId: req.userId,
            createdAt: new Date(),
          }),
        );

        totalRemainingPoints -= 1;
      }
    }

    // 플레이스 리뷰가 추가됐으면 포인트 지급
    if (!placeReviewPoint && review.placeId) {
      pointsToSave.push(
        new Point({
          id: randomUUID(),
          amount: 1,
          reviewId: req.reviewId,
          sourceType: PointSourceType.PLACE_REVIEW,
          type: PointType.ISSUANCE,
          userId: req.userId,
          createdAt: new Date(),
        }),
      );
    } else if (placeReviewPoint && !review.placeId) {
      // 플레이스 리뷰가 삭제됐으면 포인트 차감
      if (totalRemainingPoints >= 1) {
        pointsToSave.push(
          new Point({
            id: randomUUID(),
            amount: 1,
            reviewId: req.reviewId,
            sourceType: PointSourceType.PLACE_REVIEW,
            type: PointType.SPENDING,
            userId: req.userId,
            createdAt: new Date(),
          }),
        );

        totalRemainingPoints -= 1;
      }
    }

    // await this.pointRepository.save(ctx, ...pointsToSave);
    const messageBodys = pointsToSave.map((point) => JSON.stringify(point));
    const responses = await this.awsClient.sendBulkSqsMessage(messageBodys);
    return pointsToSave;
  }
}
