import express from 'express';
import { nextTick } from 'process';

import user from './routes/user.route';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/user', user);

app.use('/', (req, res, next) => {
  console.log('test');
  next();
});

app.get(
  '/',
  (req, res, next) => {
    console.log('Hello World!');
    next();
  },
  (req, res) => {
    res.send('next callback');
  }
);

app.post('/', (req, res) => {
  res.send('Got a POST request');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
