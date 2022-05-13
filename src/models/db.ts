import mysql from 'mysql2/promise';
import dbConfig from '../config/db.config';

// 데이터베이스 connection 객체 생성
// try {
const db = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});
// } catch (error) {
//   if (error) throw error;
//   console.log('Successfully connected to the database. ');
// }

export default db;
