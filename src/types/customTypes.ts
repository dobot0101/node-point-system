export {};

declare global {
  namespace Express {
    interface Request {
      decoded:any;
    }
  }
}

// "dev": "nodemon --watch \"src/**/*.ts\" --exec \"ts-node src/app.ts\""