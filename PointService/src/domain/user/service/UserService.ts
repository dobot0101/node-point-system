import { Context } from '../../../context';
import { PointType } from '../../point/entity/Point';
import { PointRepository } from '../../point/repository/interface/PointRepository';
import { UserRepository } from '../repository/interface/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository, private pointRepository: PointRepository) {}
  async isUserExists(ctx: Context, userId: string) {
    const user = await this.userRepository.findById(ctx, userId);
    return Boolean(user);
  }

  async getPointsByUserId(ctx: Context, request: GetPointListRequest) {
    return await this.pointRepository.findWithCursor(ctx, request.pageSize, request.cursor);
  }

  async getTotalPointByUserId(ctx: Context, userId: string) {
    const points = await this.pointRepository.findByUserId(ctx, userId);
    return points.reduce(
      (acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount),
      0,
    );
  }
}

export type GetPointListRequest = {
  cursor?: string;
  pageSize: number;
  userId: string;
};
