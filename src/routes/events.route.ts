import express from 'express';
import { EventController } from '../contollers/event.controller';
import { convertUUIDInRequestBody } from '../middleware/convertUUID';

const eventController = new EventController();
const router = express.Router();
router.post('/', convertUUIDInRequestBody, eventController.updatePoint);

export default router;
