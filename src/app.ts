import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Container } from './container';
import { Context } from './context';
import { initTypeOrmDataSource } from './db';
import { User } from './domain/user/entity/User';
import { CustomError } from './error/errors';

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
  app.use(createContext());
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

function createContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = new Context();
    req.context = context;
    next();
  };
}

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
