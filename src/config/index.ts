import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  testDBConfig: {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
  },
  jwtSecret: process.env.JWT_SECRET,
};
