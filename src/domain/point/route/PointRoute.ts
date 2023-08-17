import express from 'express';
import { PermissionDeniedError } from '../../../error/errors';
import { AuthService } from '../../auth/service/AuthService';
import { PermissionService } from '../../user/service/PermissionService';
import { PointService } from '../service/PointService';

export class PointRoute {
  private router;
  constructor(
    private pointService: PointService,
    private authService: AuthService,
    private permissionService: PermissionService,
  ) {
    this.router = express.Router();

    /**
     * 포인트 적립, 수정, 삭제 처리
     */
    this.router.post('/', this.authService.auth, async (req, res, next) => {
      try {
        const { body, context, userId } = req;
        if (!userId) {
          throw new PermissionDeniedError();
        }
        await this.permissionService.mustBeAdmin(context, userId);

        let result = false;
        switch (req.body.action) {
          case 'ADD':
            // 포인트 지급
            await this.pointService.createPoint(context, body);
            break;
          case 'MOD':
            // 포인트 수정
            await this.pointService.updatePoint(context, body);
            break;
          case 'DELETE':
            // 포인트 취소
            await this.pointService.deductPoint(context, body);
            break;
          default:
            throw new Error('invalid action');
        }

        res.status(200).json({ success: result });
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
