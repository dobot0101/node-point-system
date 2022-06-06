import { Request, Response } from 'express';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';
import { PointService } from '../services/point.service';

export class PointController {
  constructor(private pointService: PointService) {}

  /**
   * 모든 유저의 포인트 내역 조회
   */
  async getAllUsersPointList(req: Request, res: Response) {
    try {
      const pointList = await this.pointService.getAllUsersPointList();
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      const { message } = error as Error;
      res.json({ success: false, error: message });
    }
  }
}

export default new PointController(new PointService(new PointModel(), new ReviewModel()));
