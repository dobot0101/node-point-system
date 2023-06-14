import { Request, Response } from 'express';
import { PointRepository } from '../repositories/PointRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
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
      const pointList = await this.pointService.getPointList(userId);
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

export default new PointController(new PointService(new PointRepository(), new ReviewRepository()));
