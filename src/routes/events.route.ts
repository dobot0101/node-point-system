import express from 'express';
import { PointController } from '../contollers/point.controller';

const router = express.Router();

const eventsController = new PointController();

router.post('/point', eventsController.modifyPoint);
router.get('/point/:id', eventsController.getTotalPoint);

export default router;
