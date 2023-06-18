import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { AppDataSource } from './db';
import { PermissionDeniedError, UnAuthorizedError } from './errors';

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const port = 3000;

  const container = new Container();

  const app = express();
  app.use(express.json());
  app.use('/points', container.pointRoute.getRouter);
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
  if (err instanceof UnAuthorizedError) {
    res.status(401).send({ error: 'Unauthorized' });
  } else if (err instanceof PermissionDeniedError) {
    res.status(403).send({ error: 'Pemrissino Denied' });
  }
}
