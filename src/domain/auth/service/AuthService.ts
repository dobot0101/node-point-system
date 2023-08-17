import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { configs } from '../../../config';
import { Context } from '../../../context';
import { UnAuthenticatedError } from '../../../error/errors';
import { CreateUserDto } from '../../user/dto/CreateUserDto';
import { User } from '../../user/entity/User';
import { UserRepository } from '../../user/repository/interface/UserRepository';

export class AuthService {
  constructor(private userRepository: UserRepository) {
    // this.auth = this.auth.bind(this);
  }

  /**
   * 미들웨어로 사용되는 메서드의 경우 this의 컨텍스트가 변경돼서 this가 AuthService 클래스 인스턴스를 참조하지 않음
   * 따라서 화살표 함수로 하지 않으면 this.userRepository를 사용하려고할 때 undefined property 에러가 발생함
   * 이문제를 해결하려면 생성자에서 this를 bind하거나 아래와 같이 화살표 함수로 만들면 됨
   */
  public auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnAuthenticatedError();
      }

      const token = authorization.split(' ')[1];
      const { userId } = verify(token, configs.JWT_SECRET_KEY) as DataStoredInToken;
      const user = await this.userRepository.findById(req.context, userId);
      if (!user) {
        throw new UnAuthenticatedError();
      }
      req.userId = user.id;
      next();
    } catch (error) {
      next(error);
    }
  };

  async signUp(ctx: Context, createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findByEmail(ctx, email);
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

    return await this.userRepository.save(ctx, user);
  }

  async login(ctx: Context, data: CreateUserDto) {
    const user = await this.userRepository.findByEmail(ctx, data.email);
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
