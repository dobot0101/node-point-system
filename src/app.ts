import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { dataSource } from './db';
import { CustomError } from './error/errors';
import { User } from './domain/user/entity/User';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

async function main() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await createDefaultData();

  const port = 3000;

  const container = new Container();

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    }),
  );

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

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    res.status(err.getStatusCode()).send({ error: err.message });
  } else {
    let errorMessage;
    if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = err as string;
    }
    res.status(500).json({ success: false, error: errorMessage });
  }
}

async function createDefaultData() {
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
