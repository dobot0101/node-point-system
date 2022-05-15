import { RowDataPacket } from 'mysql';
import { CreatePointDto } from '../dto/create-point.dto';
import { EventData } from '../dto/review-event.dto';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';

const pointModel = new PointModel();
const reviewModel = new ReviewModel();

export class PointService {
  async getTotalPoints(userId: string) {
    return await pointModel.getTotalByUserId(userId);
  }
  
  async create(data: EventData): Promise<boolean> {
    try {
      // 1. 텍스트 리뷰 포인트 지급
      const createPointData: CreatePointDto = {
        reviewType: 'TEXT',
        amount: 1,
        ...data,
      };
      await pointModel.create(createPointData);

      // 2. 이미지 첨부했으면 추가 포인트 지급
      if (data.attachedPhotoIds.length > 0) {
        createPointData.reviewType = 'PHOTO';
        await pointModel.create(createPointData);
      }

      // 3. 해당 장소의 첫번째 리뷰이면 보너스 포인트 지급
      const isFirstReviewOfPlace = await reviewModel.checkIfFirstReviewOfPlace(
        data.placeId
      );
      if (isFirstReviewOfPlace) {
        createPointData.reviewType = 'BONUS';
        await pointModel.create(createPointData);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    return true;
  }

  async modify(data: EventData): Promise<boolean> {
    // 1. 사진 첨부 포인트를 받은적이 없는데 사진을 첨부한 경우 포인트 지급
    const existsPhotoPoint = await pointModel.checkPhotoPointExists(
      data.reviewId
    );

    if (data.attachedPhotoIds.length > 0 && !existsPhotoPoint) {
      await pointModel.create({
        amount: 1,
        reviewType: 'PHOTO',
        ...data,
      });
    } else if (existsPhotoPoint && data.attachedPhotoIds.length === 0) {
      /**
       * 2. 사진첨부 포인트를 받았는데, 첨부 사진을 모두 삭제한 경우 포인트 회수
       * (포인트를 사용하지 않았으면 회수, 이미 사용했으면 회수 X)
       */
      await pointModel.create({
        amount: -1,
        reviewType: 'PHOTO',
        ...data,
      });
    }

    return true;
  }

  async delete(data: EventData): Promise<boolean> {
    // 리뷰를 삭제하면 사용하지 않은 포인트 취소
    const points = (await pointModel.findUnusedByReviewId(
      data.reviewId
    )) as RowDataPacket[];

    console.log(points);

    const results = Promise.all(
      points.map(point => {
        return pointModel.create({
          amount: -1,
          reviewType: point.review_type,
          userId: point.user_id,
          reviewId: point.review_id,
        });
      })
    );

    console.log({ results });

    return true;
  }
}
