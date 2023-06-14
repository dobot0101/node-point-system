import mysql from 'mysql2/promise';
import config from '../config';

let pool: mysql.Pool;

export function connectDB() {
  pool = mysql.createPool(config.dbConfig);
  return pool;
}

export function connectTestDB() {
  pool = mysql.createPool(config.testDBConfig);
  return pool;
}

export async function getConnection() {
  return await pool.getConnection();
}

export async function query(sql: string, params?: any[]) {
  const conn = await getConnection();
  const [rows] = await conn.query(sql, params);
  conn.release();
  return rows;
}
