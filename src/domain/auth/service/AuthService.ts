import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { configs } from '../../../config';
import { CreateUserDto } from '../../user/dto/CreateUserDto';
import { User } from '../../user/entity/User';
import { UnAuthenticatedError } from '../../../error/errors';
import { UserRepository } from '../../user/repository/UserRepository';

export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async auth(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization || authorization.startsWith('Bearer ')) {
        throw new UnAuthenticatedError();
      }

      const token = authorization.split(' ')[1];
      const { userId } = verify(token, configs.JWT_SECRET_KEY) as DataStoredInToken;
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnAuthenticatedError();
      }
      req.userId = user.id;
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id: randomUUID(),
      createdAt: new Date(),
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async login(data: CreateUserDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('회원이 존재하지 않습니다.');
    }

    const isPasswordMatched = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatched) {
      throw new Error(`잘못된 비밀번호입니다.`);
    }

    const tokenData = await this.createToken(user);
    const cookie = await this.createCookie(tokenData);
    return { user, cookie };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { userId: user.id };
    const expiresIn: number = 60 * 60;
    const token = sign(dataStoredInToken, configs.JWT_SECRET_KEY, { expiresIn });

    return { expiresIn, token };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

type TokenData = {
  expiresIn: number;
  token: string;
};

type DataStoredInToken = {
  userId: string;
};
