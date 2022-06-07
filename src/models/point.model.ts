import { CreatePointDto } from '../dto/create-point.dto';
import { generateUUID } from '../utils/uuid';
import { RowDataPacket } from 'mysql';
import { getConnection, query } from './db';

export class PointModel {
  /**
   * 포인트 합계 조회
   */
  async getTotalPointByReviewId(reviewId: string) {
    const rows = (await query(
      `select source_id, ifnull(sum(amount), 0) as total_point 
        from point 
        where source_id = ? and source_type = 'REVIEW'
        group by source_id`,
      [reviewId],
    )) as RowDataPacket[];

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].total_point;
  }

  /**
   * 포인트 내역 조회
   */
  async getPointListByUserId(userId: string) {
    const rows = await query(`select * from point where user_id = ? order by created_at desc`, [userId]);

    return rows;
  }

  /**
   * 회원 아이디로 포인트 내역 조회
   */
  async getTotalPointByUserId(userId: string): Promise<number> {
    const rows = (await query(
      `select user_id, ifnull(sum(amount), 0) as total_point 
        from point 
        where user_id = ? 
        group by user_id`,
      [userId],
    )) as RowDataPacket[];

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].total_point;
  }

  /**
   * 포인트 적립
   */
  async create(data: CreatePointDto) {
    const { amount, userId, sourceId, sourceType, memo } = data;
    const id = generateUUID();

    const rows = await query(
      `insert into point (id, user_id, source_id, source_type, memo, amount) values (?, ?, ?, ?, ?, ?)`,
      [id, userId, sourceId, sourceType, memo, amount],
    );

    // return rows;
    return true;
  }

  /**
   * 리뷰 아이디로 포토 리뷰 포인트 받았는지 확인
   */
  async checkIfGivenPhotoPointByReviewId(reviewId: string) {
    const rows = (await query(
      `select ifnull(sum(amount), 0) amount from point where source_type = 'REVIEW' and source_id = ? and memo = 'PHOTO'`,
      [reviewId],
    )) as RowDataPacket[];

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].amount > 0;
  }

  /**
   * 리뷰 아이디로 리뷰 작성 포인트 받았는지 확인
   */
  async checkIfGivenPointByReviewId(reviewId: string) {
    const rows = (await query(`select count(*) as count from point where source_id = ?`, [
      reviewId,
    ])) as RowDataPacket[];

    return rows[0].count > 0;
  }

  /**
   * 전체 포인트 내역 조회
   */
  getAllUsersPointList() {
    const rows = query(`select * from point order by created_at desc`);
    return rows;
  }
}
