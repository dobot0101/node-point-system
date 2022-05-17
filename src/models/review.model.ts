import { query } from './db';

export class ReviewModel {
  async isFirstReviewOfPlace(placeId: string) {
    const result = await query(
      `select count(*) as count from review where place_id = ?`,
      [placeId]
    );

    return result.rows[0].count === 1;
  }
}
