import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {}
  async signUp(email: string, password: string) {
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
