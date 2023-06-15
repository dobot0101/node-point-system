import express from 'express';
import 'reflect-metadata';
import { Container } from './container';
import { AppDataSource } from './db';

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const port = 3000;

  const container = new Container();

  const app = express();
  app.use(express.json());
  app.use('/events', container.eventRoute.router);
  app.use('/points', container.pointRoute.router);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit();
});
