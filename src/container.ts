import { configs } from './config';
import { PointRepository } from './repositories/PointRepository';
import { ReviewRepository } from './repositories/ReviewRepository';
import { UserRepository } from './repositories/UserRepository';
import { PointRoute } from './routes/PointRoute';
import { UserRoute } from './routes/UserRoute';
import { AuthService } from './services/AuthService';
import { JwtService } from './services/JwtService';
import { PermissionService } from './services/PermissionService';
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
  jwtService = new JwtService(configs.JWT_SECRET_KEY);
  authService = new AuthService(this.jwtService, this.userRepository);
  permissionService = new PermissionService(this.userRepository);

  // router
  userRoute = new UserRoute(this.userService, this.jwtService);
  pointRoute = new PointRoute(this.pointService, this.authService, this.permissionService);
}
