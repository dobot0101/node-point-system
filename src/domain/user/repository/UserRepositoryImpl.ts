import { Context } from '../../../context';
import { getTypeOrmDataSource } from '../../../db';
import { User } from '../entity/User';
import { UserRepository } from './interface/UserRepository';

export class UserRepositoryImpl implements UserRepository {
  async save(ctx: Context, ...users: User[]) {
    return await getTypeOrmDataSource(ctx).getRepository(User).save(users);
  }
  async findById(ctx: Context, userId: string) {
    return await getTypeOrmDataSource(ctx)
      .getRepository(User)
      .findOne({
        where: {
          id: userId,
        },
      });
  }
  async findByEmail(ctx: Context, email: string) {
    return await getTypeOrmDataSource(ctx).getRepository(User).findOne({
      where: {
        email,
      },
    });
  }
  async findByIdAndPassword(ctx: Context, id: string, password: string) {
    return await getTypeOrmDataSource(ctx)
      .getRepository(User)
      .find({
        where: {
          email: id,
          password,
        },
      });
  }
}
