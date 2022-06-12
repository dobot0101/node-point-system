import { CreatePointDto } from '../../dto/create-point.dto';
import { PointModel } from '../../models/point.model';

export class PointGiver {
  private giveBehavior: PointGiveBehavior;
  constructor(private createPointDto: CreatePointDto, private pointModel: PointModel) {
    this.giveBehavior = new GiveTextReviewPoint();
  }

  setGiveBehavior(behavior: PointGiveBehavior) {
    this.giveBehavior = behavior;
  }

  performGive() {
    return this.giveBehavior.give(this.createPointDto, this.pointModel);
  }
}

interface PointGiveBehavior {
  give(createPointDto: CreatePointDto, pointModel: PointModel): Promise<boolean>;
}

export class GiveTextReviewPoint implements PointGiveBehavior {
  give(createPointDto: CreatePointDto, pointModel: PointModel): Promise<boolean> {
    createPointDto.memo = 'TEXT';
    return pointModel.create(createPointDto);
  }
}

export class GivePhotoReviewPoint implements PointGiveBehavior {
  give(createPointDto: CreatePointDto, pointModel: PointModel): Promise<boolean> {
    createPointDto.memo = 'PHOTO';
    return pointModel.create(createPointDto);
  }
}

export class GiveBonusReviewPoint implements PointGiveBehavior {
  give(createPointDto: CreatePointDto, pointModel: PointModel): Promise<boolean> {
    createPointDto.memo = 'BONUS';
    return pointModel.create(createPointDto);
  }
}
