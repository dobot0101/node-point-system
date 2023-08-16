import { Context } from '../../../context';
import { PermissionDeniedError } from '../../../error/errors';
import { UserRepository } from '../repository/UserRepository';

export class PermissionService {
  constructor(private userRepository: UserRepository) {}
  async mustBeAdmin(ctx: Context, userId: string) {
    const user = await this.userRepository.findById(ctx, userId);
    if (!user || !user.isAdmin) {
      throw new PermissionDeniedError();
    }
  }
}
