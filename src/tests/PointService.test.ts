import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { Container } from '../container';
import { dataSource } from '../db';
import { Place } from '../domain/place/entity/Place';
import { Review } from '../domain/review/entity/Review';
import { ReviewPhoto } from '../domain/review/entity/ReviewPhoto';
import { User } from '../domain/user/entity/User';

describe('PointService 테스트', () => {
  const container = new Container();

  let ds: DataSource;
  beforeAll(async () => {
    try {
      ds = await dataSource.initialize();
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await ds.destroy();
  });

  test('포토, 장소 리뷰를 작성하면 총 3개의 포인트가 생성돼야한다.', async () => {
    const place = new Place({ id: randomUUID(), title: 'test place' });
    const savedPlace = await ds.getRepository(Place).save(place);
    const adminUser = await ds.getRepository(User).findOne({
      where: {
        isAdmin: true,
      },
    });
    if (!adminUser) {
      throw new Error(`adminUser not found`);
    }
    const review = new Review({
      content: 'test review content',
      createdAt: new Date(),
      id: randomUUID(),
      modifiedAt: null,
      photos: [
        new ReviewPhoto({
          createdAt: new Date(),
          id: randomUUID(),
        }),
      ],
      placeId: savedPlace.id,
      userId: adminUser.id,
    });

    const savedReview = await ds.getRepository(Review).save(review);

    const points = await container.pointService.createPoint({
      reviewId: savedReview.id,
      userId: adminUser.id,
      placeId: savedPlace.id,
    });

    expect(points.length).toEqual(3);
  });
});
