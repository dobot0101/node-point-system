import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '..', '/secret.env'),
});

import events from './routes/events.route';
import { createTables, dropTables, initData } from './init/init';
import { connectDB } from './models/db';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

connectDB();

// DB 테이블 전체 삭제를 원할 시 아래 코드 주석 해제
// dropTables();

// DB 테이블 전체 생성을 원하면 아래 코드 주석 해제
// createTables();

// 데이터 초기화 시 주석 해제
// initData();

function createAuthToken(email: string, password: string) {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'funnynode';
    const token = jwt.sign({ email, password }, jwtSecret, {
      expiresIn: '1d',
    });

    return token;
  } catch (error: any) {
    console.log(error);
    process.exit();
  }
}

createAuthToken('test@email.com', 'test_password');

app.use(express.json());
app.use('/events', events);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
