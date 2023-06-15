import jwt from 'jsonwebtoken';
import { configs } from '../config';

export class JwtService {
  getToken(username: any) {
    const token = jwt.sign({ username }, configs.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
  }
}
