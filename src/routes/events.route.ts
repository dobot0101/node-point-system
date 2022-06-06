import express from 'express';
import eventController from '../contollers/event.controller';
import { convertUUIDInRequestBody } from '../middleware/convertUUID';

const router = express.Router();
router.post('/', convertUUIDInRequestBody, (req, res) => eventController.updatePoint(req, res));

export default router;
