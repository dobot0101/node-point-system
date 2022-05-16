import { CreatePointDto } from '../dto/create-point.dto';
// import { getConnection } from '../config/db';
import { generateUUID } from '../utils/uuid';
import { RowDataPacket } from 'mysql';
import { query } from './db';

export class PointModel {
  async getTotalPointByReviewId(reviewId: string) {
    const { rows } = await query(
      `select review_id, ifnull(sum(amount), 0) as total_point 
        from point 
        where review_id = ? 
        group by review_id`,
      [reviewId]
    );

    return rows[0].total_point;
  }
  /**
   * 회원 아이디로 포인트 내역 조회
   * @param userId 회원 아이디
   * @returns 포인트 내역
   */
  async getTotalPointByUserId(userId: string) {
    const { rows } = await query(
      `select user_id, ifnull(sum(amount), 0) as total_point 
        from point 
        where user_id = ? 
        group by user_id`,
      [userId]
    );

    return rows[0].total_point;
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

    return result.rows;
  }

  /**
   * 특정 리뷰를 작성하여 PHOTO 포인트를 지급받은 적이 잇는지 확인
   * @param reviewId 리뷰 아이디
   * @returns PHOTO 포인트 지급 여부
   */
  async hasPhotoPointByReviewId(reviewId: string) {
    const { rows } = await query(
      `select count(*) as count from point where review_id = ? and review_type = 'PHOTO'`,
      [reviewId]
    );

    return rows[0].count;
  }

  async existsPhotoPointByReviewId(reviewId: string) {
    const { rows } = await query(
      `select ifnull(sum(amount), 0) amount from point where review_type = ‘PHOTO’ and review_id = ?`,
      [reviewId]
    );

    return rows[0].amount > 0;
  }
}
