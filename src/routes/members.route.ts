import express from 'express';
import { MemberController } from '../contollers/member.controller';
import { convertUUIDInRequestParam } from '../middleware/convertUUID';

const router = express.Router();

const memberController = new MemberController();

router.get('/:userId/pointList', convertUUIDInRequestParam, memberController.getPointList);
router.get('/:userId/totalPoint', convertUUIDInRequestParam, memberController.getTotalPoint);

export default router;
