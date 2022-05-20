import { CreatePointDto } from '../dto/create-point.dto';
import { ReviewEventDto } from '../dto/review-event.dto';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';

const pointModel = new PointModel();
const reviewModel = new ReviewModel();

export class PointService {
  async create(data: ReviewEventDto): Promise<boolean> {
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

    return true;
  }

  async modify(data: ReviewEventDto): Promise<boolean> {
    const isPhotoPointGiven = await pointModel.checkIfGivenPhotoPointByReviewId(
      data.reviewId
    );

    // 1. 사진을 첨부한 경우 PHOTO 포인트가 없으면 포인트 지급
    if (data.attachedPhotoIds.length > 0 && !isPhotoPointGiven) {
      await pointModel.create({
        amount: 1,
        reviewType: 'PHOTO',
        ...data,
      });
    } else if (data.attachedPhotoIds.length === 0 && isPhotoPointGiven) {
      /**
       * 2. 첨부 사진이 없는 경우
       * PHOTO 포인트를 지급 내역이 있고,
       * 보유 포인트가 남아 있으면 포인트를 차감한다.
       */
      const havingPoint = await pointModel.getTotalPointByUserId(data.userId);
      if (havingPoint > 0) {
        await pointModel.create({
          amount: -1,
          reviewType: 'PHOTO',
          ...data,
        });
      }
    }

    return true;
  }

  /**
   * 리뷰 삭제 시 포인트 차감
   */
  async delete(data: ReviewEventDto): Promise<boolean> {
    const havingPoint = await pointModel.getTotalPointByUserId(data.userId);
    const reviewPointToDelete = await pointModel.getTotalPointByReviewId(
      data.reviewId
    );

    /**
     * 보유 포인트가 삭제할 리뷰 포인트 보다 적은 경우를 대비해서,
     * 보유 포인트와 리뷰 포인트 중 작은 값을 보유 포인트에서 뺀다.
     */
    const cancelPoint = Math.min(havingPoint, reviewPointToDelete);
    if (cancelPoint <= 0) {
      throw new Error('취소할 포인트가 없습니다.');
    }

    await pointModel.create({
      amount: cancelPoint * -1,
      reviewId: data.reviewId,
      reviewType: 'CANCEL',
      userId: data.userId,
    });

    return true;
  }

  /**
   * 특정 유저의 포인트 내역 조회
   */
  async getPointList(userId: string) {
    return await pointModel.getPointListByUserId(userId);
  }

  /**
   * 특정 유저의 포인트 합계
   */
  async getTotalPoint(userId: string): Promise<number> {
    return await pointModel.getTotalPointByUserId(userId);
  }
}
