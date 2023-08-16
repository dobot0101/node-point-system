import { randomUUID } from 'crypto';
import { Container } from '../container';
import { Context } from '../context';
import { getTypeOrmDataSource } from '../db';
import { Place } from '../domain/place/entity/Place';
import { Review } from '../domain/review/entity/Review';
import { ReviewPhoto } from '../domain/review/entity/ReviewPhoto';
import { User } from '../domain/user/entity/User';
import { runTestInTransaction } from './util';

describe('PointService 테스트', () => {
  const container = new Container();
  const ctx = new Context();

  test('포토, 장소 리뷰를 작성하면 총 3개의 포인트가 생성돼야한다.', async () => {
    await runTestInTransaction(ctx, async (ctx) => {
      const em = getTypeOrmDataSource(ctx);
      const place = new Place({ id: randomUUID(), title: 'test place' });
      const savedPlace = await em.getRepository(Place).save(place);
      const adminUser = await em.getRepository(User).findOne({
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

      const savedReview = await em.getRepository(Review).save(review);

      const points = await container.pointService.createPoint(ctx, {
        reviewId: savedReview.id,
        userId: adminUser.id,
        placeId: savedPlace.id,
      });

      expect(points.length).toEqual(3);
    });
  });
});
