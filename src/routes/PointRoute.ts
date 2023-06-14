import express from 'express';
import { Container } from '../container';
import { convertUUIDInRequestParam } from '../middleware/convertUUID';

export class PointRoute {
  public router;
  constructor(container: Container) {
    const { pointController } = container;
    this.router = express.Router();
    this.router.get('/list', (req, res) => pointController.getAllUsersPointList(req, res));
    this.router.get('/:userId/list', convertUUIDInRequestParam, (req, res) => pointController.getPointList(req, res));
    this.router.get('/:userId/total', convertUUIDInRequestParam, (req, res) => pointController.getTotalPoint(req, res));
  }
}
