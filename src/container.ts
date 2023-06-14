import { PointController } from './contollers/point.controller';
import { PointRepository } from './repositories/PointRepository';
import { ReviewRepository } from './repositories/ReviewRepository';
import { UserRepository } from './repositories/UserRepository';
import { PointService } from './services/point.service';

export class Container {
  // repository
  pointRepository = new PointRepository();
  reviewRepository = new ReviewRepository();
  userRepository = new UserRepository();

  // service
  pointService = new PointService(this.pointRepository, this.reviewRepository);

  // controller
  pointController = new PointController(this.pointService);
}
