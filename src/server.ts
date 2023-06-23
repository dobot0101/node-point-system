import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { AppDataSource } from './db';
import { PermissionDeniedError, UnAuthenticatedError } from './errors';
import cookieParser from 'cookie-parser';
import { configs } from './config';
import { verify } from 'jsonwebtoken';

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const port = 3000;

  const container = new Container();

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    }),
  );
  app.use(cookieParser());

  app.get('/', (req, res, next) => {
    res.json('Hello World');
  });
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
  if (err instanceof UnAuthenticatedError) {
    res.status(401).send({ error: 'Unauthenticated' });
  } else if (err instanceof PermissionDeniedError) {
    res.status(403).send({ error: 'Permission Denied' });
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
