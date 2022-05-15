import { RowDataPacket } from 'mysql';
import mysql from 'mysql2/promise';
import dbConfig from '../config/db.config';

let pool: mysql.Pool;

export function connectDB() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('DB 연결 성공');
  } catch (error) {
    console.log(`DB 연결 중 에러: ${error}`);
    console.log(error);
  }
}

type QueryResult = {
  // state : 쿼리문 실행 성공시 true 실패 false
  state?: boolean;
  // error : 쿼리문 error 정보 반환
  error?: Error;
  rows?: any;
};

export async function query(sql: string, params?: any[]) {
  let result: QueryResult = {
    error: undefined,
    rows: undefined,
    state: undefined,
  };
  try {
    // const connection = await pool.getConnection(async conn => conn); // 생성된 풀 정보로 DB 연결
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      // if (type == 'GET') result.row = rows;
      result.rows = rows;
      result.state = true;

      connection.release();
      return result;
    } catch (err) {
      console.log('Query Error');
      result.state = false;
      result.error = err as Error;
      connection.release();
      return result;
    }
  } catch (err) {
    console.log('DB Error');
    result.state = false;
    result.error = err as Error;
    return result;
  }
}
