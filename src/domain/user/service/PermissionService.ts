import { PermissionDeniedError } from '../../../error/errors';
import { UserRepository } from '../repository/UserRepository';

export class PermissionService {
  constructor(private userRepository: UserRepository) {}
  async mustBeAdmin(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isAdmin) {
      throw new PermissionDeniedError();
    }
  }
}
