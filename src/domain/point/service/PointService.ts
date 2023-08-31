import { Context } from '../../../context';
import { PointRequest } from '../dto/PointRequest';
import { PointServiceStrategy } from './strategy/PointServiceStrategy';

export class PointService {
  constructor(private pointServiceStrategy: PointServiceStrategy) {}

  async execute(ctx: Context, req: PointRequest) {
    return this.pointServiceStrategy.execute(ctx, req);
  }

  public setStrategy(pointServiceStrategy: PointServiceStrategy) {
    this.pointServiceStrategy = pointServiceStrategy;
  }
}
