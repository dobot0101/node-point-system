import { Request, Response } from 'express';
import { PointService } from '../services/point.service';

export class PointController {
  async getTotalPoint(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const pointService = new PointService();
      const totalPoint = await pointService.getTotalPoint(userId);
      res.status(200).json({ success: true, totalPoint });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }

  async getPointList(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const pointService = new PointService();
      const pointList = await pointService.getPointList(userId);
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
