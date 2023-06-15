import { AppDataSource } from '../db';
import { User } from '../entities/User';

export class UserRepository {
  async findByEmail(email: string) {
    return await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
  }
  async findByIdAndPassword(id: string, password: string) {
    return await AppDataSource.getRepository(User).find({
      where: {
        email: id,
        password,
      },
    });
  }
}
