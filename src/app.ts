import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import express from 'express';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Container } from './container';
import { initTypeOrmDataSource } from './db';
import { User } from './domain/user/entity/User';
import { createContext } from './middleware/createContext';
import { errorHandler } from './middleware/errorHandler';

async function main() {
  const dataSource = await initTypeOrmDataSource();

  const container = new Container();

  await createDefaultData(dataSource);

  const port = 3000;

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    }),
  );
  app.use(createContext);
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

async function createDefaultData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const users = await userRepository.findBy({
    isAdmin: true,
  });
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('test', 10);
    await userRepository.save(
      new User({
        id: randomUUID(),
        createdAt: new Date(),
        email: 'test@test.com',
        isAdmin: true,
        password: hashedPassword,
      }),
    );
  }
}
