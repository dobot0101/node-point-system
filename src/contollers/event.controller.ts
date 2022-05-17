import { Request, Response } from 'express';
import { PointService, PointServiceResult } from '../services/point.service';

export class EventController {
  async updatePoint(req: Request, res: Response) {
    try {
      const pointService = new PointService();
      const { body } = req;
      let result: PointServiceResult = {
        success: false,
      };

      switch (req.body.action) {
        case 'ADD':
          result = await pointService.create(body);
          break;
        case 'MOD':
          result = await pointService.modify(body);
          break;
        case 'DELETE':
          result = await pointService.delete(body);
          break;
        default:
          throw new Error('invalid action');
      }

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        // res.status(500).json({ success: false, error: error.message });
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
