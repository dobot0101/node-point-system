import express from 'express';
import { AuthService } from '../domain/auth/service/AuthService';
import { PointService } from '../domain/point/service/PointService';
import { PermissionService } from '../domain/user/service/PermissionService';
import { PermissionDeniedError } from '../error/errors';

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

    /**
     * 특정 회원의 포인트 목록 조회
     */
    this.router.get('/:userId/list', this.authService.auth, async (req, res, next) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(req.context, userId);
        const pointList = await this.pointService.getPointsByUserId(req.context, userId);
        res.status(200).json({ success: true, pointList });
      } catch (error) {
        next(error);
      }
    });

    /**
     * 특정 회원의 보유 포인트 조회
     */
    this.router.get('/:userId/total', this.authService.auth, async (req, res, next) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(req.context, userId);
        const totalPoint = await this.pointService.getTotalPointByUserId(req.context, userId);
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
