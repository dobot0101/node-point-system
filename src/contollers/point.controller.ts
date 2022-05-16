import { Request, Response } from 'express';
import { CreateResult, PointService } from '../services/point.service';

export class PointController {
  async modifyPoint(req: Request, res: Response) {
    try {
      const { body } = req;
      const pointService = new PointService();
      let result: CreateResult;

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
        res.status(400).json({ error: error.message });
      }
    }
  }

  async getTotalPoint(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pointService = new PointService();
      const points = await pointService.getTotalPoints(id);
      res.status(200).json({ success: true, points });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      }
    }
  }
}
