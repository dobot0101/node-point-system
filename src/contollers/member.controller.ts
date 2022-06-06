import { Request, Response } from 'express';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';
import { PointService } from '../services/point.service';

export class MemberController {
  constructor(private pointService: PointService) {}
  /**
   * 특정 유저의 포인트 합계 조회
   */
  async getTotalPoint(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const totalPoint = await this.pointService.getTotalPoint(userId);
      res.status(200).json({ success: true, totalPoint });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }

  /**
   * 특정 유저의 포인트 내역 조회
   */
  async getPointList(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      console.log(userId);
      console.log(this.pointService);
      const pointList = await this.pointService.getPointList(userId);
      console.log(pointList);
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

export default new MemberController(new PointService(new PointModel(), new ReviewModel()));
