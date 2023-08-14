import { randomUUID } from 'crypto';
import { PointRequest } from '../dto/PointRequest';
import { Point, PointSourceType, PointType } from '../entities/Point';
import { PointRepository } from '../repositories/PointRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';

export class PointUpdateService {
  constructor(private pointRepository: PointRepository, private reviewRepository: ReviewRepository) {}

  async updatePoint(req: PointRequest) {
    const points = await this.pointRepository.findByReviewId(req.reviewId);
    if (points.length === 0) {
      throw new Error('포인트 지급 내역이 존재하지 않습니다.');
    }

    const review = await this.reviewRepository.findById(req.reviewId);
    if (!review) {
      throw new Error(`리뷰가 존재하지 않습니다.`);
    }

    // 포토 리뷰 포인트를 받았는지 확인
    const photoReviewPoint = points.find((point) => point.sourceType === PointSourceType.PHOTO_REVIEW);
    const placeReviewPoint = points.find((point) => point.sourceType === PointSourceType.PLACE_REVIEW);
    let totalRemainingPoints = points.reduce(
      (acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount),
      0,
    );

    const pointsToSave = [];

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

    await this.pointRepository.save(...pointsToSave);
  }
}
