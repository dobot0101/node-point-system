import { Request, Response } from 'express';
import { PointService } from '../services/point.service';

const pointService = new PointService();

export class PointController {

  /**
   * 모든 유저의 포인트 내역 조회
   */
  async getAllUsersPointList(req: Request, res: Response) {
    try {
      const pointList = await pointService.getAllUsersPointList();
      res.status(200).json({ success: true, pointList });
    } catch (error) {
      const { message } = error as Error;
      res.json({ success: false, error: message });
    }
  }
}
