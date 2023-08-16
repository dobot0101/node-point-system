import { randomUUID } from 'crypto';
import { Context } from '../../../context';
import { UserNotFoundError } from '../../../error/errors';
import { UserService } from '../../user/service/UserService';
import { PointRequest } from '../dto/PointRequest';
import { Point, PointSourceType, PointType } from '../entity/Point';
import { PointRepository } from '../repository/PointRepository';

export class PointDeductService {
  constructor(private pointRepository: PointRepository, private userService: UserService) {}

  async deductPoint(ctx: Context, req: PointRequest) {
    if (!(await this.userService.isUserExists(ctx, req.userId))) {
      throw new UserNotFoundError();
    }

    const userPoints = await this.pointRepository.findByUserId(ctx, req.userId);
    const totalRemainingPoints = userPoints.reduce(
      (acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount),
      0,
    );
    const totalReviewPoints = userPoints
      .filter((point) => point.reviewId === req.reviewId)
      .reduce((acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount), 0);

    /**
     * 보유 포인트가 삭제하는 리뷰의 포인트 보다 적은 경우
     * 보유 포인트와 리뷰 포인트 중 작은 값을 차감한다.
     */
    const cancelPointAmount = Math.min(totalRemainingPoints, totalReviewPoints);
    if (cancelPointAmount <= 0) {
      throw new Error('취소할 포인트가 없습니다.');
    }

    const point = new Point({
      id: randomUUID(),
      userId: req.userId,
      reviewId: req.reviewId,
      sourceType: PointSourceType.CANCELED_REVIEW,
      type: PointType.SPENDING,
      amount: cancelPointAmount,
      createdAt: new Date(),
    });

    await this.pointRepository.save(ctx, point);

    return point;
  }
}
