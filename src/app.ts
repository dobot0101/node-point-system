import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '..', '/secret.env'),
});

import events from './routes/events.route';
import point from './routes/point.route';
import { auth } from './middleware/auth';
import { convertUUIDToUseIndex } from './middleware/convertRequestValue';

export const app = express();
export const port = process.env.PORT;

app.use(express.json());
app.use('/events', auth, convertUUIDToUseIndex, events);
app.use('/point', auth, point);
