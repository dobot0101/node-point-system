import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import express from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { dataSource, initTypeOrmDataSource } from './db';
import { Place } from './domain/place/entity/Place';
import { Review } from './domain/review/entity/Review';
import { User } from './domain/user/entity/User';
import { createContext } from './middleware/createContext';
import { errorHandler } from './middleware/errorHandler';

async function main() {
  await initTypeOrmDataSource();
  const container = new Container();
  await createDefaultData();

  const port = 3000;

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    }),
  );
  app.use(createContext);
  app.use('/auth', container.authRoute.getRouter());
  app.use('/users', container.userRoute.getRouter());
  app.use('/points', container.pointRoute.getRouter());
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit();
});

async function createDefaultData() {
  let adminUser = await createAdminUser();
  const place = await createPlace();
  await createReviews(place, adminUser);
}
async function createReviews(place: Place, adminUser: User) {
  const reviewRepository = dataSource.getRepository(Review);
  const reviews = await reviewRepository.find();
  if (reviews.length === 0) {
    for (let i = 0; i < 10; i++) {
      reviews.push(
        new Review({
          content: `test review content ${i}`,
          createdAt: new Date(),
          id: randomUUID(),
          placeId: place.id,
          userId: adminUser.id,
        }),
      );
    }
    await reviewRepository.save(reviews);
  }
}

async function createPlace() {
  const placeRepository = dataSource.getRepository(Place);
  const places = await placeRepository.find();
  let place;
  if (places.length === 0) {
    place = new Place({
      id: randomUUID(),
      title: 'test place',
    });
    await placeRepository.save(place);
  } else {
    place = places[0];
  }
  return place;
}

async function createAdminUser() {
  const userRepository = dataSource.getRepository(User);
  let adminUser = await userRepository.findOneBy({ isAdmin: true });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('test', 10);
    adminUser = new User({
      id: randomUUID(),
      createdAt: new Date(),
      email: 'test@test.com',
      isAdmin: true,
      password: hashedPassword,
    });
    await userRepository.save(adminUser);
  }
  return adminUser;
}
