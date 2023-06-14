// import express from 'express';
// import memberController from '../contollers/member.controller';
// import { convertUUIDInRequestParam } from '../middleware/convertUUID';
// import { App } from '../app';
// import { Container } from '../server';

// export class UserRoute {
//   public router;
//   constructor(private container: Container) {
//     this.router = express.Router();
//     this.router.post('/login', (req, res) => {
//       const { username, password } = req.body;

//       getServices().userService.login(username, password);

//       if (username === 'admin' && password === 'password') {
//         const token = jwt.sign({ username }, configs.JWT_SECRET_KEY, { expiresIn: '1h' });
//         res.json({ token });
//       } else {
//         res.status(401).json({ message: 'Invalid id or password' });
//       }
//     });
//   }
// }
