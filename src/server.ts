import { createTables, dropTables, initData } from './init/init';
import { connectDB } from './models/db';
import jwt from './utils/jwt';
import { app, port } from './app';

async function main() {
  connectDB();
  // DB 테이블 전체 삭제를 원할 시 아래 코드 주석 해제
  await dropTables();
  // DB 테이블 전체 생성을 원하면 아래 코드 주석 해제
  await createTables();
  // 데이터 초기화 시 주석 해제
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
