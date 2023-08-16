import { Context } from '../../../context';
import { UserRepository } from '../repository/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {}
  async isUserExists(ctx: Context, userId: string) {
    const user = await this.userRepository.findById(ctx, userId);
    return Boolean(user);
  }
}
