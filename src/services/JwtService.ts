import jwt from 'jsonwebtoken';
import { configs } from '../config';

export type DecodedJwtToken = {
  userId: string;
};
export class JwtService {
  constructor(private jwtSecretKey: string) {}
  decodeToken(token: string) {
    return jwt.verify(token, this.jwtSecretKey) as DecodedJwtToken;
  }

  encodeToken(userId: string) {
    return jwt.sign({ username: userId }, configs.JWT_SECRET_KEY, { expiresIn: '1h' });
  }
}
