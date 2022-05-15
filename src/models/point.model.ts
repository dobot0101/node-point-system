import { CreatePointDto } from '../dto/create-point.dto';
// import { getConnection } from '../config/db';
import { generateUUID } from '../utils/uuid';
import { RowDataPacket } from 'mysql';
import { query } from './db';

export class PointModel {
  /**
   * 회원 아이디로 포인트 내역 조회
   * @param userId 회원 아이디
   * @returns 포인트 내역
   */
  async getTotalByUserId(userId: string) {
    try {
      const result = await query(
        `select user_id, sum(amount) as total_point 
        from point 
        where user_id = ? 
        group by user_id`,
        [userId]
      );

      return result.rows[0].total_point;
    } catch (error) {
      console.log(`getTotalByUserId error: ${error}`);
      throw error;
    }
  }

  /**
   * 포인트 데이터를 저장하는 함수
   * @param data 포인트 데이터를 저장하기 위한 데이터 객체
   * @returns 저장 결과
   */
  async create(data: CreatePointDto) {
    const { amount, userId, reviewId, reviewType } = data;
    const id = generateUUID();

    const result = await query(
      `insert into point (id, user_id, review_id, review_type, amount) values (?, ?, ?, ?, ?)`,
      [id, userId, reviewId, reviewType, amount]
    );

    console.log(result);

    return result;
  }

  /**
   * 특정 리뷰를 작성하여 PHOTO 포인트를 지급받은 적이 잇는지 확인
   * @param reviewId 리뷰 아이디
   * @returns PHOTO 포인트 지급 여부
   */
  async checkPhotoPointExists(reviewId: string) {
    const result = await query(
      `select count(*) as count from point where review_id = ? and review_type = 'PHOTO'`,
      [reviewId]
    );
    console.log(result);
    return result;
  }

  /**
   * 리뷰 아이디로 사용되지 않은 포인트 조회
   * @param reviewId 리뷰 아이디
   * @returns 조회결과 rows
   */
  async findUnusedByReviewId(reviewId: string) {
    const result = await query(
      `select * from point where review_id = ? and is_used = false`,
      [reviewId]
    );
    return result.rows;
  }
}
