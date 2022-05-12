import express from 'express';
import { UserService } from '../services/user.service';
const router = express.Router();

const userService = new UserService();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  try {
    const users = userService.getAll();
    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

// define the about route
router.get('/:id', (req, res) => {
  const user = userService.getOne(parseInt(req.params.id));
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send('user not found.');
  }
});

router.post('/', (req, res) => {
  const createdUser = userService.create(req.body);
  res.status(201).send(createdUser);
});

router.delete('/:id', (req, res) => {
  try {
    console.log(`delete user with id: ${req.params.id}`);
    const deletedId = userService.deleteOne(parseInt(req.params.id));
    res.status(200).send({ deletedId });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
      console.log(error.message);
    }
  }

  // res.status(200).send(deletedId);
});

router.put('/:id', (req, res) => {
  console.log(req.body);
  const userId = parseInt(req.params.id);
  const updatedUser = userService.update(userId, req.body);
  if (updatedUser) {
    res.status(200).send({ updatedUser });
  } else {
    res
      .status(404)
      .send({ errorMessage: `user with id: ${userId} not found.` });
  }
});

export default router;
