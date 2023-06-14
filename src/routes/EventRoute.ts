import express from 'express';
import { Container } from '../container';
import { convertUUIDInRequestBody } from '../middleware/convertUUID';

export class EventRoute {
  public router;
  constructor(private container: Container) {
    this.router = express.Router();
    this.router.post('/', convertUUIDInRequestBody, async (req, res) => {
      try {
        const { body } = req;

        let result = false;
        const { pointService } = this.container;
        switch (req.body.action) {
          case 'ADD':
            await pointService.createPoint(body);
            break;
          case 'MOD':
            await pointService.updatePoint(body);
            break;
          case 'DELETE':
            await pointService.deletePoint(body);
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
    });
  }
}
