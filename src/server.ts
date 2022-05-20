import {
  createIndexes,
  createTables,
  dropIndexes,
  dropTables,
  initData,
} from './init/init';
import { connectDB } from './models/db';
import jwt from './utils/jwt';
import { app, port } from './app';

async function main() {
  connectDB();

  // db 초기화
  await dropIndexes();
  await dropTables();
  await createTables();
  await createIndexes();
  await initData();

  const accessToken = jwt.sign({
    email: 'test@email.com',
    password: 'testpassword',
  });

  console.log({ accessToken });

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit();
});
