import express from 'express';
import pointController from '../contollers/point.controller';

const router = express.Router();

router.get('/list', (req, res) => pointController.getAllUsersPointList(req, res));

export default router;
