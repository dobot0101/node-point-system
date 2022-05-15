import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname, '..', '/secret.env'),
});

import events from './routes/events.route';
import { createTables, dropTables, initData } from './init/migration';
import { connectDB } from './models/db';

const app = express();
const port = 3000;

connectDB();

// DB 테이블 전체 삭제를 원할 시 아래 코드 주석 해제
// dropTables();
createTables();

// 데이터 초기화 시 주석 해제
// initData();

app.use(express.json());
// app.use('/', (req, res, next) => {
//   next();
// });
app.use('/events', events);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
