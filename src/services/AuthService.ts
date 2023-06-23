import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, User } from '../entities/User';
import { UnAuthenticatedError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from './JwtService';

export class AuthService {
  constructor(private jwtService: JwtService, private userRepository: UserRepository) {}
  async checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization || authorization.startsWith('Bearer ')) {
        throw new UnAuthenticatedError();
      }

      const token = authorization.split(' ')[1];
      const { userId } = this.jwtService.decodeToken(token);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnAuthenticatedError();
      }
      req.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`이미 회원가입된 이메일입니다.`);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      id: randomUUID(),
      createdAt: new Date(),
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('회원이 존재하지 않습니다.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error(`잘못된 비밀번호입니다.`);
    }

    return true;
  }
}
