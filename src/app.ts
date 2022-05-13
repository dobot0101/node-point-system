import express from 'express';
import events from './routes/events.route';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/events', events);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
