import express from 'express';
import { PermissionDeniedError } from '../../../error/errors';
import { AuthService } from '../../auth/service/AuthService';
import { PermissionService } from '../service/PermissionService';
import { UserService } from '../service/UserService';

export class UserRoute {
  private router;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private permissionService: PermissionService,
  ) {
    this.router = express.Router();

    /**
     * 특정 회원의 포인트 목록 조회 페이지네이션
     */
    this.router.get('/:userId/points', this.authService.auth, async (req, res, next) => {
      try {
        if (!req.userId) {
          throw new PermissionDeniedError();
        }
        const { cursor, pageSize } = req.query;

        // await this.permissionService.mustBeAdmin(req.context, req.userId);
        const pointList = await this.userService.getPointsByUserId(req.context, {
          cursor: cursor ? cursor.toString() : undefined,
          pageSize: pageSize ? parseInt(pageSize.toString()) : 10,
          userId: req.userId,
        });

        res.status(200).json({ success: true, pointList });
      } catch (error) {
        next(error);
      }
    });

    /**
     * 특정 회원의 보유 포인트 조회
     */
    this.router.get('/:userId/total-point', this.authService.auth, async (req, res, next) => {
      try {
        const { userId } = req.params;

        // await this.permissionService.mustBeAdmin(req.context, userId);
        const totalPoint = await this.userService.getTotalPointByUserId(req.context, userId);
        res.status(200).json({ success: true, totalPoint });
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
