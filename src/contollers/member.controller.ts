import { Request, Response } from 'express';
import { PointService } from '../services/point.service';

const pointService = new PointService();

export class MemberController {
  /**
   * 특정 유저의 포인트 합계 조회
   */
  async getTotalPoint(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const totalPoint = await pointService.getTotalPoint(userId);
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
      const pointList = await pointService.getPointList(userId);
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
