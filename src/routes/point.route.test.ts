import request from 'supertest';
import { app } from '../app';
import { createTables, dropTables, initData } from '../init/init';
import { closeConnection, connectDB, getConnection } from '../models/db';
import jwt from '../utils/jwt';
import { convertUUID } from '../utils/uuid';

beforeAll(async () => {
  connectDB();
  await dropTables();
  await createTables();
  await initData();
});

// 인증 토큰 생성
const token = jwt.sign({
  email: 'test@email.com',
  password: 'testpassword',
});

const userId = convertUUID('3ede0ef2-92b7-4817-a5f3-0c575361f745');

describe(`포인트 조회 API 테스트`, () => {
  test('보유 포인트 합계를 조회한다.', async () => {
    const res = await request(app)
      .get(`/point/total/${userId}`)
      .set('Authorization', token);

    const { success, totalPoint } = res.body;

    expect(success).toBe(true);
    expect(parseInt(totalPoint)).toBeGreaterThanOrEqual(0);
  });

  test('보유 포인트 목록을 조회한다.', async () => {
    const res = await request(app)
      .get(`/point/list/${userId}`)
      .set('Authorization', token);

    const { success, pointList } = res.body;

    expect(success).toBe(true);
    expect(pointList.length).toBeGreaterThanOrEqual(0);
  });
});
