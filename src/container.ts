import { PointRepository } from './repositories/PointRepository';
import { ReviewRepository } from './repositories/ReviewRepository';
import { UserRepository } from './repositories/UserRepository';
import { EventRoute } from './routes/EventRoute';
import { PointRoute } from './routes/PointRoute';
import { UserRoute } from './routes/UserRoute';
import { JwtService } from './services/JwtService';
import { PointService } from './services/PointService';
import { UserService } from './services/UserService';

export class Container {
  // repository
  pointRepository = new PointRepository();
  reviewRepository = new ReviewRepository();
  userRepository = new UserRepository();

  // service
  pointService = new PointService(this.pointRepository, this.reviewRepository);
  userService = new UserService(this.userRepository);
  jwtService = new JwtService();

  // router
  eventRoute = new EventRoute(this.pointService);
  userRoute = new UserRoute(this.userService, this.jwtService);
  pointRoute = new PointRoute(this.pointService);
}
