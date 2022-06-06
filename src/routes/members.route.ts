import express from 'express';
import memberController from '../contollers/member.controller';
import { convertUUIDInRequestParam } from '../middleware/convertUUID';

const router = express.Router();

router.get('/:userId/pointList', convertUUIDInRequestParam, (req, res) => memberController.getPointList(req, res));
router.get('/:userId/totalPoint', convertUUIDInRequestParam, (req, res) => memberController.getTotalPoint(req, res));

export default router;
