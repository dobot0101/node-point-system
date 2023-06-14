import 'reflect-metadata';
import { createHttpApp } from './app';
import { Container } from './container';
import { AppDataSource } from './db';

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const port = 3000;

  const app = new Container();

  createHttpApp(app).listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit();
});
