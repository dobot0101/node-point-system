import express from 'express';
import { PointStrategyMap } from '../../../container';
import { PermissionDeniedError } from '../../../error/errors';
import { AuthService } from '../../auth/service/AuthService';
import { PermissionService } from '../../user/service/PermissionService';
import { PointService } from '../service/PointService';

export class PointController {
  private router;
  constructor(
    private pointService: PointService,
    private authService: AuthService,
    private permissionService: PermissionService,
    private pointStrategyMap: PointStrategyMap,
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

        /**
         * ADD: 포인트 지급
         * MOD: 포인트 수정
         * DELETE: 포인트 취소
         */
        switch (req.body.action) {
          case 'ADD':
            this.pointService.setStrategy(this.pointStrategyMap.createPointStrategy);
            break;
          case 'MOD':
            this.pointService.setStrategy(this.pointStrategyMap.updatePointStrategy);
            break;
          case 'DELETE':
            this.pointService.setStrategy(this.pointStrategyMap.deductPointStrategy);
            break;
          default:
            throw new Error('invalid action');
        }

        await this.pointService.execute(context, {
          userId,
          reviewId: body.reviewId,
          placeId: body.placeId,
        });

        res.status(200).json({ success: true });
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
