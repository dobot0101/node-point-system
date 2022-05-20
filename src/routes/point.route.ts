import express from 'express';
import { PointController } from '../contollers/point.controller';
import { convertUUIDInRequestParam } from '../middleware/convertUUID';

const router = express.Router();

const pointController = new PointController();

router.get(
  '/total/:userId',
  convertUUIDInRequestParam,
  pointController.getTotalPoint
);
router.get(
  '/list/:userId',
  convertUUIDInRequestParam,
  pointController.getPointList
);

export default router;
