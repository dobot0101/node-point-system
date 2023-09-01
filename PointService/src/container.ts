import { configs } from './config';
import { AuthRoute } from './domain/auth/controller/AuthController';
import { AuthService } from './domain/auth/service/AuthService';
import { JwtService } from './domain/auth/service/JwtService';
import { PointController } from './domain/point/controller/PointController';
import { PointRepositoryImpl } from './domain/point/repository/PointRepositoryImpl';
import { PointService } from './domain/point/service/PointService';
import { CreatePointStrategy } from './domain/point/service/strategy/CreatePointStrategy';
import { DeductPointStrategy } from './domain/point/service/strategy/DeductPointStrategy';
import { UpdatePointStrategy } from './domain/point/service/strategy/UpdatePointStrategy';
import { ReviewRepositoryImpl } from './domain/review/repository/ReviewRepositoryImpl';
import { UserController } from './domain/user/controller/UserController';
import { UserRepositoryImpl } from './domain/user/repository/UserRepositoryImpl';
import { PermissionService } from './domain/user/service/PermissionService';
import { UserService } from './domain/user/service/UserService';

export type PointStrategyMap = {
  createPointStrategy: CreatePointStrategy;
  updatePointStrategy: UpdatePointStrategy;
  deductPointStrategy: DeductPointStrategy;
};

export class Container {
  constructor() {}
  // repository
  public pointRepositoryImpl = new PointRepositoryImpl();
  public reviewRepositoryImpl = new ReviewRepositoryImpl();
  public userRepositoryImpl = new UserRepositoryImpl();

  // strategy
  public pointStrategyMap: PointStrategyMap = {
    createPointStrategy: new CreatePointStrategy(this.pointRepositoryImpl, this.reviewRepositoryImpl),
    updatePointStrategy: new UpdatePointStrategy(this.pointRepositoryImpl, this.reviewRepositoryImpl),
    deductPointStrategy: new DeductPointStrategy(this.pointRepositoryImpl),
  };

  // service
  public jwtService = new JwtService(configs.JWT_SECRET_KEY);
  public authService = new AuthService(this.userRepositoryImpl);
  public pointService = new PointService(this.pointStrategyMap.createPointStrategy);
  public userService = new UserService(this.userRepositoryImpl, this.pointRepositoryImpl);
  public permissionService = new PermissionService(this.userRepositoryImpl);

  // router
  public authRoute = new AuthRoute(this.authService, this.jwtService);
  public userRoute = new UserController(this.userService, this.authService, this.permissionService);
  public pointRoute = new PointController(
    this.pointService,
    this.authService,
    this.permissionService,
    this.pointStrategyMap,
  );
}
