import express from 'express';
import { PointController } from '../contollers/point.controller';

const router = express.Router();

const pointController = new PointController();

router.get('/list', pointController.getAllUsersPointList);

export default router;
