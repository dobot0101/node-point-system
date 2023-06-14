import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DB_HOST) throw new Error(`DB_HOST doesn't exist in env`);
if (!process.env.DB_USER) throw new Error(`DB_USER doesn't exist in env`);
if (!process.env.DB_PASSWORD) throw new Error(`DB_PASSWORD doesn't exist in env`);
if (!process.env.DB_DATABASE) throw new Error(`DB_DATABASE doesn't exist in env`);
if (!process.env.JWT_SECRET_KEY) throw new Error(`JWT_SECRET_KEY doesn't exist in env`);

export const configs = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
