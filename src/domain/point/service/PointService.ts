import { Context } from '../../../context';
import { DeductPointRequest } from '../dto/DeductPointRequest';
import { CreatePointRequest } from '../dto/CreatePointRequest';
import { UpdatePointRequest } from '../dto/UpdatePointRequest';
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

  async createPoint(ctx: Context, req: CreatePointRequest): Promise<Point[]> {
    return this.pointCreateService.createPoint(ctx, req);
  }

  async updatePoint(ctx: Context, req: UpdatePointRequest) {
    return this.pointUpdateService.updatePoint(ctx, req);
  }

  async deductPoint(ctx: Context, req: DeductPointRequest) {
    return this.pointDeductService.deductPoint(ctx, req);
  }

  async getPointsByUserId(ctx: Context, userId: string) {
    return await this.pointRepository.findByUserId(ctx, userId);
  }

  async getTotalPointByUserId(ctx: Context, userId: string) {
    const points = await this.pointRepository.findByUserId(ctx, userId);
    return points.reduce((acc, point) => acc + point.amount, 0);
  }
}
