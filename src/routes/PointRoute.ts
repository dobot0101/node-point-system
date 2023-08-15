import express from 'express';
import { AuthService } from '../domain/auth/service/AuthService';
import { PointService } from '../domain/point/service/PointService';
import { PermissionService } from '../domain/user/service/PermissionService';

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
        await this.permissionService.mustBeAdmin(req.userId!);
        const { body } = req;

        let result = false;
        switch (req.body.action) {
          case 'ADD':
            await this.pointService.createPoint(body);
            break;
          case 'MOD':
            await this.pointService.updatePoint(body);
            break;
          case 'DELETE':
            await this.pointService.deductPoint(body);
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
     * 유저 아이디로 포인트 목록 조회
     */
    // this.router.get('/:userId/list', convertUUIDInRequestParam, async (req, res) => {
    this.router.get('/:userId/list', this.authService.auth, async (req, res, next) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(userId);
        const pointList = await this.pointService.getPointByUserId(userId);
        res.status(200).json({ success: true, pointList });
      } catch (error) {
        next(error);
      }
    });

    /**
     * 유저 아이디로 총 포인트 조회
     */
    // this.router.get('/:userId/total', convertUUIDInRequestParam, async (req, res) => {
    this.router.get('/:userId/total', this.authService.auth, async (req, res, next) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(userId);
        const totalPoint = await this.pointService.getTotalPointByUserId(userId);
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
