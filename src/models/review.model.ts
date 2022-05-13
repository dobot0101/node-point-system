import sql from './db';
import mysql from 'mysql2/promise';

export class ReviewModel {
  async checkIfFirstReviewOfPlace(placeId: string) {
    const rows = await sql
      .query(`select count(*) as count from review where place_id = ?`, [
        placeId,
      ])
      .then(([rows]) => rows as mysql.RowDataPacket[]);
    return rows[0].count === 0;
  }
}
