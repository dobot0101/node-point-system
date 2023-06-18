import { PermissionDeniedError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';

export class PermissionService {
  constructor(private userRepository: UserRepository) {}
  async mustBeAdmin(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isAdmin) {
      throw new PermissionDeniedError();
    }
  }
}
