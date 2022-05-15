import express from 'express';
import { EventsController } from '../contollers/events.controller';

const router = express.Router();

const eventsController = new EventsController();

router.post('/', eventsController.modifyPoint);
router.get('/:id', eventsController.getTotalPoint);

export default router;
