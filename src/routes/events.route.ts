import express from 'express';
import { EventController } from '../contollers/event.controller';

const router = express.Router();

const eventController = new EventController();

router.post('/', eventController.updatePoint);

export default router;
