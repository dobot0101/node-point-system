import { randomUUID } from 'crypto';
import { CreateReviewBody } from '../dto/CreateReviewBody';
import { Point } from '../entities/Point';
import { PointRepository } from '../repositories/PointRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';

export class PointService {
  constructor(private pointRepository: PointRepository, private reviewRepository: ReviewRepository) {}

  async createPoint(data: CreateReviewBody): Promise<Point[]> {
    const existingPoint = await this.pointRepository.findByReviewId(data.reviewId);
    if (existingPoint.length > 0) {
      throw new Error('이미 포인트가 지급되었습니다.');
    }

    const points: Point[] = [];

    // 텍스트 리뷰
    points.push(
      this.createPointInstance({
        amount: 1,
        memo: '텍스트 리뷰 포인트',
        sourceId: data.reviewId,
        userId: data.userId,
      }),
    );

    // 이미지 첨부했으면 포토 리뷰 포인트
    if (data.attachedPhotoIds.length > 0) {
      points.push(
        this.createPointInstance({
          amount: 1,
          memo: '포토 리뷰 포인트',
          sourceId: data.reviewId,
          userId: data.userId,
        }),
      );
    }

    // 3. 해당 장소의 첫번째 리뷰이면 보너스 포인트 지급
    const reviews = await this.reviewRepository.findByPlaceId(data.placeId);
    if (reviews.length === 1) {
      points.push(
        this.createPointInstance({
          amount: 1,
          memo: '보너스 리뷰 포인트',
          sourceId: data.reviewId,
          userId: data.userId,
        }),
      );
    }

    await Promise.all(points.map(async (point) => await this.pointRepository.save(point)));

    return points;
  }

  private createPointInstance(data: CreatePointData): Point {
    return new Point({
      id: randomUUID(),
      amount: data.amount,
      memo: data.memo,
      sourceId: data.sourceId,
      sourceType: 'REVIEW',
      userId: data.userId,
      createdAt: new Date(),
    });
  }

  async updatePoint(data: CreateReviewBody) {
    const existingPoints = await this.pointRepository.findByReviewId(data.reviewId);
    if (existingPoints.length === 0) {
      throw new Error('포인트 지급 내역이 존재하지 않습니다.');
    }

    // 포토 리뷰 포인트를 받았는지 확인
    const photoReviewPoint = existingPoints.find((point) => point.sourceType === 'PHOTO_REVIEW');

    // 1. 사진을 첨부한 경우 PHOTO 포인트가 없으면 포인트 지급
    if (data.attachedPhotoIds.length > 0 && !photoReviewPoint) {
      const point = this.createPointInstance({
        amount: 1,
        memo: '포토 리뷰 포인트',
        sourceId: data.reviewId,
        userId: data.userId,
      });
      await this.pointRepository.save(point);
    } else if (data.attachedPhotoIds.length === 0 && photoReviewPoint) {
      /**
       * 2. 첨부 사진이 없는 경우
       * PHOTO 포인트를 지급 내역이 있고,
       * 보유 포인트가 남아 있으면 포인트를 차감한다.
       */
      const points = await this.pointRepository.findByUserId(data.userId);
      if (points.length > 0) {
        const point = this.createPointInstance({
          amount: -1,
          memo: '포토 리뷰 포인트',
          sourceId: data.reviewId,
          userId: data.userId,
        });
        await this.pointRepository.save(point);
      }
    }
  }

  /**
   * 리뷰 삭제 시 포인트 차감
   */
  async deductPoint(data: CreateReviewBody) {
    const havingPoints = await this.pointRepository.findByUserId(data.userId);
    const totalHavingPoint = havingPoints.reduce((acc, point) => acc + point.amount, 0);
    const totalReviewPoint = havingPoints
      .filter((point) => point.sourceId === data.reviewId)
      .reduce((acc, point) => acc + point.amount, 0);

    /**
     * 보유 포인트가 삭제할 리뷰 포인트 보다 적은 경우를 대비해서,
     * 보유 포인트와 리뷰 포인트 중 작은 값을 보유 포인트에서 뺀다.
     */
    const cancelPoint = Math.min(totalHavingPoint, totalReviewPoint);
    if (cancelPoint <= 0) {
      throw new Error('취소할 포인트가 없습니다.');
    }

    await this.pointRepository.save(
      this.createPointInstance({
        amount: cancelPoint * -1,
        memo: '포인트 취소',
        sourceId: data.reviewId,
        userId: data.userId,
      }),
    );
  }

  async getPointByUserId(userId: string) {
    return await this.pointRepository.findByUserId(userId);
  }

  async getTotalPointByUserId(userId: string) {
    const points = await this.pointRepository.findByUserId(userId);
    return points.reduce((acc, point) => acc + point.amount, 0);
  }
}

export type CreatePointData = {
  amount: number;
  memo: string;
  sourceId: string;
  // sourceType: string;
  userId: string;
};
