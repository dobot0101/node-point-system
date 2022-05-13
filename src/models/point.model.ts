import { CreatePointDto } from '../dto/create-point.dto';
import sql from './db';
import mysql from 'mysql2/promise';
import { generateUUID } from '../utils/uuid';

export class PointModel {
  async create(data: CreatePointDto) {
    const { amount, userId, reviewId, reviewType } = data;
    const id = generateUUID();
    const result = await sql.query(
      `insert into point (id, user_id, review_id, review_type, amount) values (?, ?, ?, ?, ?)`,
      [id, userId, reviewId, reviewType, amount]
    );

    console.log(result);

    return result;
  }

  async checkPhotoPointExists(reviewId: string) {
    const rows = await sql
      .query(
        `select count(*) as count from point where review_id = ? and review_type = 'PHOTO'`,
        [reviewId]
      )
      .then(([rows]) => rows as mysql.RowDataPacket[]);
    return rows[0].count > 0;
  }

  /**
   * 리뷰 아이디로 사용되지 않은 포인트 조회
   * @param reviewId 리뷰 아이디
   * @returns 조회결과 rows
   */
  async findUnusedByReviewId(reviewId: string) {
    const rows = await sql
      .query(`select * from point where review_id = ? and is_used = false`, [
        reviewId,
      ])
      .then(([rows]) => rows as mysql.RowDataPacket[]);
    return rows;
  }
}
