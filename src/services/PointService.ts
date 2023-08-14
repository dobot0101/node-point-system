import { CreateReviewRequest } from '../dto/CreatePointRequest';
import { PointRequest } from '../dto/PointRequest';
import { Point } from '../entities/Point';
import { PointCreateService } from './PointCreateService';
import { PointUpdateService } from './PointUpdateService';

export class PointService {
  constructor(private pointCreateService: PointCreateService, private pointUpdateService: PointUpdateService) {}

  async createPoint(req: PointRequest): Promise<Point[]> {
    return this.pointCreateService.createPoint(req);
  }

  async updatePoint(req: PointRequest) {
    return this.pointUpdateService.updatePoint(req);
  }

  /**
   * 리뷰 삭제 시 포인트 차감
   */
  async deductPoint(data: CreateReviewRequest) {
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

export type CreatePointInstanceData = {
  amount: number;
  memo: string;
  sourceId: string;
  sourceType: string;
  userId: string;
};
