import { randomUUID } from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { Container } from '../container';
import { Context } from '../context';
import { getTypeOrmDataSource } from '../db';
import { Place } from '../domain/place/entity/Place';
import { Point, PointType } from '../domain/point/entity/Point';
import { Review } from '../domain/review/entity/Review';
import { ReviewPhoto } from '../domain/review/entity/ReviewPhoto';
import { User } from '../domain/user/entity/User';
import { runTestInTransaction } from './util';

describe('PointService 테스트', () => {
  const container = new Container();
  const ctx = new Context();

  test('리뷰 포인트를 지급하고 취소하면 보유 포인트가 0이 된다.', async () => {
    await runTestInTransaction(ctx, async (ctx) => {
      const em = getTypeOrmDataSource(ctx);
      const { adminUser, savedPlace, savedReview } = await createReview(em);
      await createPoints(container, ctx, savedReview, adminUser, savedPlace);

      const { pointService, userService } = container;

      pointService.setStrategy(container.pointStrategyMap.deductPointStrategy);
      await pointService.execute(ctx, {
        reviewId: savedReview.id,
        userId: adminUser.id,
      });

      const point = await userService.getTotalPointByUserId(ctx, adminUser.id);
      expect(point).toStrictEqual(0);
    });
  });

  test(`포토, 장소 리뷰에서 사진을 취소하면 1포인트가 차감되어 총 2포인트여야 한다.`, async () => {
    await runTestInTransaction(ctx, async (ctx) => {
      const em = getTypeOrmDataSource(ctx);
      const { adminUser, savedPlace, savedReview } = await createReview(em);
      await createPoints(container, ctx, savedReview, adminUser, savedPlace);

      savedReview.photos = [];
      await em.getRepository(Review).save(savedReview);

      const { pointService } = container;
      pointService.setStrategy(container.pointStrategyMap.updatePointStrategy);
      await pointService.execute(ctx, {
        reviewId: savedReview.id,
        userId: adminUser.id,
      });

      const points = await container.pointRepositoryImpl.findByReviewId(ctx, savedReview.id);
      const foundPoint = points.find((point) => point.amount === 1 && point.type === PointType.SPENDING);
      expect(Boolean(foundPoint)).toBeTruthy();

      const remainingPoint = points.reduce((acc, val) => {
        if (val.type === PointType.ISSUANCE) {
          return acc + val.amount;
        } else {
          return acc - val.amount;
        }
      }, 0);
      expect(remainingPoint).toStrictEqual(2);
    });
  });

  test('포토, 장소 리뷰를 작성하면 총 3개의 포인트가 생성돼야한다.', async () => {
    await runTestInTransaction(ctx, async (ctx) => {
      const em = getTypeOrmDataSource(ctx);
      const { adminUser, savedPlace, savedReview } = await createReview(em);
      const points = await createPoints(container, ctx, savedReview, adminUser, savedPlace);
      if (!points || points) {
      }

      expect(points.length).toEqual(3);
    });
  });
});

async function createPoints(
  container: Container,
  ctx: Context,
  savedReview: Review,
  adminUser: User,
  savedPlace: Place,
) {
  const { pointService, pointStrategyMap } = container;
  pointService.setStrategy(pointStrategyMap.createPointStrategy);
  const createdPoints = (await pointService.execute(ctx, {
    reviewId: savedReview.id,
    userId: adminUser.id,
    placeId: savedPlace.id,
  })) as Point[];
  return createdPoints;
}

async function createReview(em: EntityManager | DataSource) {
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
  return { adminUser, savedPlace, savedReview };
}
