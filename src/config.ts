import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET_KEY) throw new Error(`JWT_SECRET_KEY doesn't exist in env`);

export const configs = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
