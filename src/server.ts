import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { AppDataSource } from './db';
import { CustomError } from './error/errors';

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
