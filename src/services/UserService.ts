import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {}
  async isUserExists(userId: string) {
    const user = await this.userRepository.findById(userId);
    return Boolean(user);
  }
}
