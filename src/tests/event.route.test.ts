import request from 'supertest';
import { app } from '../app';
import {
  createIndexes,
  createTables,
  dropIndexes,
  dropTables,
  initData,
} from '../init/init';
import { connectTestDB, query } from '../models/db';
import jwt from '../utils/jwt';
import { convertUUID } from '../utils/uuid';

const attachedPhotoIds = [
  'e4d1a64e-a531-46de-88d0-ff0ed70c0bb8',
  'afb0cef2-851d-4a50-bb07-9cc15cbdc332',
];

// API 요청 데이터
const data = {
  type: 'REVIEW',
  action: 'ADD',
  reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
  content: '좋아요!',
  attachedPhotoIds,
  userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
  placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
};

// 인증 토큰 생성
const token = jwt.sign({
  email: 'test@email.com',
  password: 'testpassword',
});

const userId = convertUUID('3ede0ef2-92b7-4817-a5f3-0c575361f745');

describe(`리뷰 포인트 지급, 수정, 취소 테스트`, () => {
  beforeAll(async () => {
    connectTestDB();
    await createTables();
    await createIndexes();
    await initData();
  });

  afterEach(async () => {
    query(`delete from point;`);
  });

  test('새 리뷰를 작성하여 포인트를 지급한다', async () => {
    data.action = 'ADD';
    data.attachedPhotoIds = attachedPhotoIds;
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });

    const res = await requestGetTotalPoint();

    expect(parseInt(res.body.totalPoint)).toBe(3);
  });

  it('리뷰에 사진을 첨부했다가 삭제하여 받았던 포인트를 회수한다', async () => {
    // 포토 리뷰 포인트 생성
    data.action = 'ADD';
    data.attachedPhotoIds = attachedPhotoIds;
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });

    // 포토 리뷰 포인트를 받은 리뷰의 사진을 삭제하여 포인트 회수
    data.action = 'MOD';
    data.attachedPhotoIds = [];
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });

    const res = await requestGetTotalPoint();

    expect(parseInt(res.body.totalPoint)).toBe(2);
  });

  it(`작성한 텍스트 리뷰에 사진을 추가하여 추가 포인트를 지급한다`, async () => {
    // 포토 리뷰 포인트 생성
    data.action = 'ADD';
    data.attachedPhotoIds = [];
    await request(app).post('/events').set('Authorization', token).send(data);

    // 포토 리뷰 포인트를 받은 리뷰의 사진을 삭제하여 포인트 회수
    data.action = 'MOD';
    data.attachedPhotoIds = attachedPhotoIds;
    await request(app).post('/events').set('Authorization', token).send(data);

    const res = await requestGetTotalPoint();

    expect(parseInt(res.body.totalPoint)).toBe(3);
  });

  it('특정 리뷰의 모든 포인트를 차감한다', async () => {
    // 포토 리뷰 포인트 생성
    data.action = 'ADD';
    data.attachedPhotoIds = [];
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });

    data.action = 'DELETE';
    await request(app)
      .post('/events')
      .set('Authorization', token)
      .send(data)
      .expect(200, { success: true });

    const res = await requestGetTotalPoint();

    expect(parseInt(res.body.totalPoint)).toBe(0);
  });

  afterAll(async () => {
    await dropIndexes();
    await dropTables();
  });
});

async function requestGetTotalPoint() {
  return await request(app)
    .get(`/point/total/${userId}`)
    .set('Authorization', token);
}
