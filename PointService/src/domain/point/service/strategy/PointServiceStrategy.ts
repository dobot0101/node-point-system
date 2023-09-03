import { Context } from '../../../../context';
import { PointRequest } from '../../dto/PointRequest';
import { Point } from '../../entity/Point';

export interface PointServiceStrategy {
  execute(ctx: Context, req: PointRequest): Promise<Point[]>;
}
