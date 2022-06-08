import { RowDataPacket } from 'mysql2';
import { ReviewEventDto } from '../dto/review-event.dto';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';
import { PointService } from '../services/point.service';

describe('point service unit test', () => {
  test('should return true', async () => {
    const pointModel: PointModel = {
      checkIfGivenPointByReviewId: async () => false,
      checkIfGivenPhotoPointByReviewId: async () => true,
      create: async (createPointData) => true,
      getAllUsersPointList: async () =>
        [
          { userId: '1', point: 300 },
          { userId: '2', point: 300 },
          { userId: '3', point: 300 },
        ] as RowDataPacket[],
      getPointListByUserId: async () => [] as RowDataPacket[],
      getTotalPointByReviewId: async () => [] as RowDataPacket[],
      getTotalPointByUserId: async () => 100,
    };

    const reviewModel: ReviewModel = {
      checkIfFirstReviewOfPlace: async () => true,
    };

    const pointService = new PointService(pointModel, reviewModel);
    const data: ReviewEventDto = {
      action: 'TEST',
      attachedPhotoIds: ['1', '2'],
      content: 'contents',
      placeId: '123',
      reviewId: '123',
      type: 'REVIEW',
      userId: '123',
    };
    const result = await pointService.createPoint(data);
    expect(result).toBe(true);
  });
});
