import { Request, Response } from 'express';
import { PointModel } from '../models/point.model';
import { ReviewModel } from '../models/review.model';
import { PointService } from '../services/point.service';

export class EventController {
  constructor(private pointService: PointService) {}
  async updatePoint(req: Request, res: Response) {
    try {
      // const pointService = new PointService();
      const { body } = req;

      let result = false;
      switch (req.body.action) {
        case 'ADD':
          result = await this.pointService.createPoint(body);
          break;
        case 'MOD':
          result = await this.pointService.modifyPoint(body);
          break;
        case 'DELETE':
          result = await this.pointService.deletePoint(body);
          break;
        default:
          throw new Error('invalid action');
      }

      res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

export default new EventController(new PointService(new PointModel(), new ReviewModel()));
