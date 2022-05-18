import request from 'supertest';
import { app } from '../app';
import { createTables, dropTables, initData } from '../init/init';
import { closeConnection, connectDB, getConnection } from '../models/db';
import jwt from '../utils/jwt';

beforeAll(async () => {
  connectDB();
  await dropTables();
  await createTables();
  await initData();
});

// API 요청 데이터
const data = {
  type: 'REVIEW',
  action: 'ADD',
  reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
  content: '좋아요!',
  attachedPhotoIds: ['e4d1a64e-a531-46de-88d0-ff0ed70c0bb8'],
  userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
  placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
};

// 인증 토큰 생성
const token = jwt.sign({
  email: 'test@email.com',
  password: 'testpassword',
});

describe(`포인트 지급, 수정, 차감 테스트`, () => {
  test('포인트를 지급한다', async () => {
    data.action = 'ADD';
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });
  });

  it('지급한 포인트를 수정한다', async () => {
    data.action = 'MOD';
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });
  });

  it('특정 리뷰의 모든 포인트를 차감한다', async () => {
    data.action = 'DELETE';
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });
  });
});
