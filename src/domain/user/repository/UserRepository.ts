import { dataSource } from '../../../db';
import { User } from '../entity/User';

export class UserRepository {
  async save(...users: User[]) {
    return await dataSource.getRepository(User).save(users);
  }
  async findById(userId: string) {
    return await dataSource.getRepository(User).findOne({
      where: {
        id: userId,
      },
    });
  }
  async findByEmail(email: string) {
    return await dataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
  }
  async findByIdAndPassword(id: string, password: string) {
    return await dataSource.getRepository(User).find({
      where: {
        email: id,
        password,
      },
    });
  }
}
