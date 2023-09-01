import { Context } from '../../../../context';
import { User } from '../../entity/User';

export interface UserRepository {
  save(ctx: Context, ...users: User[]): Promise<User[]>;
  findById(ctx: Context, userId: string): Promise<User | null>;
  findByEmail(ctx: Context, email: string): Promise<User | null>;
  findByIdAndPassword(ctx: Context, id: string, password: string): Promise<User[]>;
}
