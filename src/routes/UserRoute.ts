import express from 'express';
import { JwtService } from '../services/JwtService';
import { UserService } from '../services/UserService';
import { UnAuthorizedError } from '../errors';

export class UserRoute {
  private router;
  constructor(private userService: UserService, private jwtService: JwtService) {
    this.router = express.Router();

    this.router.post('/login', async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (await this.userService.login(email, password)) {
          const token = this.jwtService.encodeToken(email);
          res.json({ token });
        } else {
          throw new UnAuthorizedError('Invalid id or password');
        }
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/register', async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const user = await this.userService.signUp(email, password);
        res.json(user);
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
