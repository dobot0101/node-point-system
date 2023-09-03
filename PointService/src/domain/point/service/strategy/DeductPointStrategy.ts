import { randomUUID } from 'crypto';
import { Context } from '../../../../context';
import { AwsClient } from '../../../aws/AwsClient';
import { PointRequest } from '../../dto/PointRequest';
import { Point, PointSourceType, PointType } from '../../entity/Point';
import { PointRepository } from '../../repository/interface/PointRepository';
import { PointServiceStrategy } from './PointServiceStrategy';

export class DeductPointStrategy implements PointServiceStrategy {
  constructor(private pointRepository: PointRepository, private awsClient: AwsClient) {}

  async execute(ctx: Context, request: PointRequest) {
    const userPoints = await this.pointRepository.findByUserId(ctx, request.userId);
    const totalRemainingPoints = userPoints.reduce(
      (acc, point) => (point.type === PointType.ISSUANCE ? acc + point.amount : acc - point.amount),
      0,
    );
    const totalReviewPoints = userPoints
      .filter((point) => point.reviewId === request.reviewId)
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
      userId: request.userId,
      reviewId: request.reviewId,
      sourceType: PointSourceType.CANCELED_REVIEW,
      type: PointType.SPENDING,
      amount: cancelPointAmount,
      createdAt: new Date(),
    });

    const responses = await this.awsClient.sendSqsMessage(JSON.stringify(point));
    return [point];
  }
}
