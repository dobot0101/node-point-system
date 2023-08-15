import { configs } from './config';
import { AuthService } from './domain/auth/service/AuthService';
import { JwtService } from './domain/auth/service/JwtService';
import { PointRepository } from './domain/point/repository/PointRepository';
import { PointCreateService } from './domain/point/service/PointCreateService';
import { PointDeductService } from './domain/point/service/PointDeductService';
import { PointService } from './domain/point/service/PointService';
import { PointUpdateService } from './domain/point/service/PointUpdateService';
import { ReviewRepository } from './domain/review/repository/ReviewRepository';
import { UserRepository } from './domain/user/repository/UserRepository';
import { PermissionService } from './domain/user/service/PermissionService';
import { UserService } from './domain/user/service/UserService';
import { AuthRoute } from './routes/AuthRoute';
import { PointRoute } from './routes/PointRoute';

export class Container {
  // repository
  public pointRepository = new PointRepository();
  public reviewRepository = new ReviewRepository();
  public userRepository = new UserRepository();

  // service
  public jwtService = new JwtService(configs.JWT_SECRET_KEY);
  public authService = new AuthService(this.userRepository);
  public userService = new UserService(this.userRepository);
  public pointCreateService = new PointCreateService(this.pointRepository, this.reviewRepository, this.userService);
  public pointUpdateService = new PointUpdateService(this.pointRepository, this.reviewRepository, this.userService);
  public pointDeductService = new PointDeductService(this.pointRepository, this.userService);
  public pointService = new PointService(
    this.pointCreateService,
    this.pointUpdateService,
    this.pointDeductService,
    this.pointRepository,
  );
  public permissionService = new PermissionService(this.userRepository);

  // router
  public userRoute = new AuthRoute(this.authService, this.jwtService);
  public pointRoute = new PointRoute(this.pointService, this.authService, this.permissionService);
}
