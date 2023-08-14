import { PointRequest } from '../dto/PointRequest';
import { Point } from '../entities/Point';
import { PointRepository } from '../repositories/PointRepository';
import { PointCreateService } from './PointCreateService';
import { PointDeductService } from './PointDeductService';
import { PointUpdateService } from './PointUpdateService';

export class PointService {
  constructor(
    private pointCreateService: PointCreateService,
    private pointUpdateService: PointUpdateService,
    private pointDeductService: PointDeductService,
    private pointRepository: PointRepository,
  ) {}

  async createPoint(req: PointRequest): Promise<Point[]> {
    return this.pointCreateService.createPoint(req);
  }

  async updatePoint(req: PointRequest) {
    return this.pointUpdateService.updatePoint(req);
  }

  /**
   * 리뷰 삭제 시 포인트 차감
   */
  async deductPoint(req: PointRequest) {
    return this.pointDeductService.deductPoint(req);
  }

  async getPointByUserId(userId: string) {
    return await this.pointRepository.findByUserId(userId);
  }

  async getTotalPointByUserId(userId: string) {
    const points = await this.pointRepository.findByUserId(userId);
    return points.reduce((acc, point) => acc + point.amount, 0);
  }
}
