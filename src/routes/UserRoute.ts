import express from 'express';
import { JwtService } from '../services/JwtService';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';

export class UserRoute {
  private router;
  constructor(private userService: UserService, private jwtService: JwtService) {
    this.router = express.Router();

    this.router.post('/login', async (req, res) => {
      const { email, password } = req.body;
      if (await this.userService.login(email, password)) {
        const token = this.jwtService.encodeToken(email);
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid id or password' });
      }
    });

    this.router.post('/register', async (req, res) => {
      const { email, password } = req.body;
      const user = await this.userService.signUp(email, password);
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ message: 'Invalid id or password' });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
