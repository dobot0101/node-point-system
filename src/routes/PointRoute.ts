import express from 'express';
import { convertUUIDInRequestParam } from '../middleware/convertUUID';
import { PointService } from '../services/PointService';

export class PointRoute {
  private router;
  constructor(private pointService: PointService) {
    this.router = express.Router();
    this.router.get('/list', async (req, res) => {
      try {
        const pointList = await this.pointService.getAllUsersPointList();
        res.status(200).json({ success: true, pointList });
      } catch (error) {
        const { message } = error as Error;
        res.json({ success: false, error: message });
      }
    });
    this.router.get('/:userId/list', convertUUIDInRequestParam, async (req, res) => {
      try {
        const { userId } = req.params;
        const pointList = await this.pointService.getPointList(userId);
        res.status(200).json({ success: true, pointList });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ success: false, error: error.message });
        }
      }
    });
    this.router.get('/:userId/total', convertUUIDInRequestParam, async (req, res) => {
      try {
        const { userId } = req.params;
        const totalPoint = await this.pointService.getTotalPoint(userId);
        res.status(200).json({ success: true, totalPoint });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ success: false, error: error.message });
        }
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
