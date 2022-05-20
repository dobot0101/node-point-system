import { RowDataPacket } from 'mysql2';
import { query } from './db';

export class ReviewModel {
  async checkIfFirstReviewOfPlace(placeId: string) {
    const rows = (await query(
      `select count(*) as count from review where place_id = ?`,
      [placeId]
    )) as RowDataPacket[];

    return rows[0].count === 1;
  }
}
