import { CreatePointDto } from '../dto/create-point.dto';
import { ReviewEventDto } from '../dto/review-event.dto';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';

export class PointService {
  constructor(private pointModel: PointModel, private reviewModel: ReviewModel) {}
  async create(data: ReviewEventDto): Promise<boolean> {
    // 이미 포인트가 지급되었는지 확인
    const isPointGiven = await this.pointModel.checkIfGivenPointByReviewId(data.reviewId);
    if (isPointGiven) {
      throw new Error('이미 포인트가 지급되었습니다.');
    }

    // 1. 텍스트 리뷰 포인트 지급
    const createPointData: CreatePointDto = {
      memo: 'TEXT',
      sourceType: data.type,
      sourceId: data.reviewId,
      userId: data.userId,
      amount: 1,
    };
    await this.pointModel.create(createPointData);

    // 2. 이미지 첨부했으면 추가 포인트 지급
    if (data.attachedPhotoIds.length > 0) {
      createPointData.memo = 'PHOTO';
      await this.pointModel.create(createPointData);
    }

    // 3. 해당 장소의 첫번째 리뷰이면 보너스 포인트 지급
    const isFirstReviewOfPlace = await this.reviewModel.checkIfFirstReviewOfPlace(data.placeId);
    if (isFirstReviewOfPlace) {
      createPointData.memo = 'BONUS';
      await this.pointModel.create(createPointData);
    }

    return true;
  }

  async modify(data: ReviewEventDto): Promise<boolean> {
    // 원본 리뷰가 있는지 확인
    const isPointGiven = await this.pointModel.checkIfGivenPointByReviewId(data.reviewId);
    if (!isPointGiven) {
      throw new Error('포인트 지급 내역이 존재하지 않습니다.');
    }

    // 포토 리뷰 포인트를 받았는지 확인
    const isPhotoPointGiven = await this.pointModel.checkIfGivenPhotoPointByReviewId(data.reviewId);

    // 1. 사진을 첨부한 경우 PHOTO 포인트가 없으면 포인트 지급
    if (data.attachedPhotoIds.length > 0 && !isPhotoPointGiven) {
      await this.pointModel.create({
        amount: 1,
        sourceId: data.reviewId,
        sourceType: data.type,
        userId: data.userId,
        memo: 'PHOTO',
      });
    } else if (data.attachedPhotoIds.length === 0 && isPhotoPointGiven) {
      /**
       * 2. 첨부 사진이 없는 경우
       * PHOTO 포인트를 지급 내역이 있고,
       * 보유 포인트가 남아 있으면 포인트를 차감한다.
       */
      const havingPoint = await this.pointModel.getTotalPointByUserId(data.userId);
      if (havingPoint > 0) {
        await this.pointModel.create({
          amount: -1,
          sourceId: data.reviewId,
          sourceType: data.type,
          memo: 'PHOTO',
          userId: data.userId,
        });
      }
    }

    return true;
  }

  /**
   * 리뷰 삭제 시 포인트 차감
   */
  async delete(data: ReviewEventDto): Promise<boolean> {
    // 총 보유 포인트 조회
    const havingPoint = await this.pointModel.getTotalPointByUserId(data.userId);

    // 삭제할 포인트 조회
    const reviewPointToDelete = await this.pointModel.getTotalPointByReviewId(data.reviewId);

    /**
     * 보유 포인트가 삭제할 리뷰 포인트 보다 적은 경우를 대비해서,
     * 보유 포인트와 리뷰 포인트 중 작은 값을 보유 포인트에서 뺀다.
     */
    const cancelPoint = Math.min(havingPoint, reviewPointToDelete);
    if (cancelPoint <= 0) {
      throw new Error('취소할 포인트가 없습니다.');
    }

    await this.pointModel.create({
      amount: cancelPoint * -1,
      sourceType: data.type,
      sourceId: data.reviewId,
      memo: 'CANCEL',
      userId: data.userId,
    });

    return true;
  }

  /**
   * 특정 유저의 포인트 내역 조회
   */
  async getPointList(userId: string) {
    return await this.pointModel.getPointListByUserId(userId);
  }

  /**
   * 특정 유저의 포인트 합계
   */
  async getTotalPoint(userId: string): Promise<number> {
    return await this.pointModel.getTotalPointByUserId(userId);
  }

  /**
   * 전체 포인트 내역 조회
   */
  async getAllUsersPointList() {
    return await this.pointModel.getAllUsersPointList();
  }
}
