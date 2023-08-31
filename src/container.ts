import { configs } from './config';
import { AuthRoute } from './domain/auth/route/AuthRoute';
import { AuthService } from './domain/auth/service/AuthService';
import { JwtService } from './domain/auth/service/JwtService';
import { PointRepositoryImpl } from './domain/point/repository/PointRepositoryImpl';
import { PointController } from './domain/point/controller/PointController';
import { PointCreateService } from './domain/point/service/PointCreateService';
import { PointDeductService } from './domain/point/service/PointDeductService';
import { PointService } from './domain/point/service/PointService';
import { PointUpdateService } from './domain/point/service/PointUpdateService';
import { ReviewRepositoryImpl } from './domain/review/repository/ReviewRepositoryImpl';
import { UserRepositoryImpl } from './domain/user/repository/UserRepositoryImpl';
import { UserController } from './domain/user/controller/UserController';
import { PermissionService } from './domain/user/service/PermissionService';
import { UserService } from './domain/user/service/UserService';

export class Container {
  constructor() {}
  // repository
  public pointRepositoryImpl = new PointRepositoryImpl();
  public reviewRepositoryImpl = new ReviewRepositoryImpl();
  public userRepositoryImpl = new UserRepositoryImpl();

  // service
  public jwtService = new JwtService(configs.JWT_SECRET_KEY);
  public authService = new AuthService(this.userRepositoryImpl);

  public pointCreateService = new PointCreateService(this.pointRepositoryImpl, this.reviewRepositoryImpl);
  public pointUpdateService = new PointUpdateService(this.pointRepositoryImpl, this.reviewRepositoryImpl);
  public pointDeductService = new PointDeductService(this.pointRepositoryImpl);
  public pointService = new PointService(this.pointCreateService, this.pointUpdateService, this.pointDeductService);
  public userService = new UserService(this.userRepositoryImpl, this.pointRepositoryImpl);
  public permissionService = new PermissionService(this.userRepositoryImpl);

  // router
  public authRoute = new AuthRoute(this.authService, this.jwtService);
  public userRoute = new UserController(this.userService, this.authService, this.permissionService);
  public pointRoute = new PointController(this.pointService, this.authService, this.permissionService);
}
