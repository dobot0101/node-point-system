import request from 'supertest';
import { app } from '../app';
import { createTables, dropTables, initData } from '../init/init';
import { connectTestDB } from '../models/db';

import jwt from '../utils/jwt';
import { convertUUID } from '../utils/uuid';

// 인증 토큰 생성
const token = jwt.sign({
  email: 'test@email.com',
  password: 'testpassword',
});

const userId = convertUUID('3ede0ef2-92b7-4817-a5f3-0c575361f745');

describe(`point search API test`, () => {
  beforeAll(async () => {
    connectTestDB();
    await createTables();
    await initData();
  });

  it(`should return all users point list`, async () => {
    const res = await request(app).get(`/points/list`).set('Authorization', token);
    const { success, pointList } = res.body;
    expect(success).toBe(true);
    expect(pointList.length).toBeGreaterThanOrEqual(0);
  });

  afterAll(async () => {
    await dropTables();
  });
});
