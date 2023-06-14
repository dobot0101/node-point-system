import express from 'express';
import { EventRoute } from './routes/EventRoute';
import { PointRoute } from './routes/PointRoute';
import { Container } from './container';
// import { convertUUIDInRequestBody } from './middleware/convertRequestValue';

export function createHttpApp(container: Container) {
  const app = express();
  app.use(express.json());

  const eventRoute = new EventRoute(container);
  // const userRoute = new UserRoute(container);
  const pointRoute = new PointRoute(container);

  app.use('/events', eventRoute.router);
  app.use('/points', pointRoute.router);
  // app.use('/users', userRoute.router);
  return app;
}
