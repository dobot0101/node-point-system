import { Context } from '../../../context';
import { CreatePointRequest } from '../dto/CreatePointRequest';
import { DeductPointRequest } from '../dto/DeductPointRequest';
import { UpdatePointRequest } from '../dto/UpdatePointRequest';
import { Point } from '../entity/Point';
import { PointCreateService } from './PointCreateService';
import { PointDeductService } from './PointDeductService';
import { PointUpdateService } from './PointUpdateService';

export class PointService {
  constructor(
    private pointCreateService: PointCreateService,
    private pointUpdateService: PointUpdateService,
    private pointDeductService: PointDeductService,
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
}
