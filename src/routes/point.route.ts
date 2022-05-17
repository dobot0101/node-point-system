import express, { Request, Response } from 'express';
import { PointController } from '../contollers/point.controller';

const router = express.Router();

const pointController = new PointController();

router.get('/total/:userId', pointController.getTotalPoint);
router.get('/list/:userId', pointController.getPointList);

export default router;
