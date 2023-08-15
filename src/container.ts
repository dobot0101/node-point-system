import { configs } from './config';
import { PointRepository } from './repositories/PointRepository';
import { ReviewRepository } from './repositories/ReviewRepository';
import { UserRepository } from './repositories/UserRepository';
import { AuthRoute } from './routes/AuthRoute';
import { PointRoute } from './routes/PointRoute';
import { AuthService } from './services/AuthService';
import { JwtService } from './services/JwtService';
import { PermissionService } from './services/PermissionService';
import { PointCreateService } from './services/PointCreateService';
import { PointDeductService } from './services/PointDeductService';
import { PointService } from './services/PointService';
import { PointUpdateService } from './services/PointUpdateService';
import { UserService } from './services/UserService';

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
