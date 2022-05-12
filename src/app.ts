import express from 'express';

import user from './routes/user.route';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/user', user);

app.use('/', (req, res) => {
  console.log('test');
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

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});

app
  .route('/book')
  .get((req, res) => {
    res.send('Get a random book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update the book');
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
