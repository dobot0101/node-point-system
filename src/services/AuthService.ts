import { NextFunction, Request, Response } from 'express';
import { UnAuthorizedError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from './JwtService';

export class AuthService {
  constructor(private jwtService: JwtService, private userRepository: UserRepository) {}
  async checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization || authorization.startsWith('Bearer ')) {
        throw new UnAuthorizedError();
      }

      const token = authorization.split(' ')[1];
      const { userId } = this.jwtService.decodeToken(token);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnAuthorizedError();
      }
      req.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  }
}
