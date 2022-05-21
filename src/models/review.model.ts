import { RowDataPacket } from 'mysql2';
import { query } from './db';

export class ReviewModel {
  /**
   * 특정 장소의 첫번째 리뷰인지 확인
   */
  async checkIfFirstReviewOfPlace(placeId: string) {
    const rows = (await query(`select count(*) as count from review where place_id = ?`, [placeId])) as RowDataPacket[];

    return rows[0].count === 1;
  }
}
