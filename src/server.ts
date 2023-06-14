import 'reflect-metadata';
import config from './config';
import jwt from './utils/jwt';
import { app } from './app';
import { DataSource } from 'typeorm';

async function main() {
  const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'db',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'point',
    entities: ['./entities/*.ts', '../dist/entities/*.js'],
    synchronize: true,
    logging: true,
  });

  // to initialize initial connection with the database, register all entities
  // and "synchronize" database schema, call "initialize()" method of a newly created database
  // once in your application bootstrap
  AppDataSource.initialize()
    .then(() => {
      const accessToken = jwt.sign({
        email: 'test@email.com',
        password: 'testpassword',
      });

      console.log({ accessToken });

      const { port } = config;
      app.listen(port, () => {
        console.log(`listening on port ${port}`);
      });
    })
    .catch((error) => console.log(error));
}

main().catch((err) => {
  console.error(err);
  process.exit();
});
