import { Context } from '../../../context';
import { PointRequest } from '../dto/PointRequest';
import { Point } from '../entity/Point';
import { PointRepository } from '../repository/PointRepository';
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

  async createPoint(ctx: Context, req: PointRequest): Promise<Point[]> {
    return this.pointCreateService.createPoint(ctx, req);
  }

  async updatePoint(ctx: Context, req: PointRequest) {
    return this.pointUpdateService.updatePoint(ctx, req);
  }

  async deductPoint(ctx: Context, req: PointRequest) {
    return this.pointDeductService.deductPoint(ctx, req);
  }

  async getPointByUserId(ctx: Context, userId: string) {
    return await this.pointRepository.findByUserId(ctx, userId);
  }

  async getTotalPointByUserId(ctx: Context, userId: string) {
    const points = await this.pointRepository.findByUserId(ctx, userId);
    return points.reduce((acc, point) => acc + point.amount, 0);
  }
}
