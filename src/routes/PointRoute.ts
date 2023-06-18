import express from 'express';
import { AuthService } from '../services/AuthService';
import { PermissionService } from '../services/PermissionService';
import { PointService } from '../services/PointService';
import { convertUUIDInRequestBody } from '../middleware/convertUUID';

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
    this.router.post('/', this.authService.checkAuth, async (req, res) => {
      try {
        const { body, userId } = req;
        await this.permissionService.mustBeAdmin(userId!);

        let result = false;
        switch (req.body.action) {
          case 'ADD':
            await this.pointService.createPoint(body);
            break;
          case 'MOD':
            await this.pointService.updatePoint(body);
            break;
          case 'DELETE':
            await this.pointService.deletePoint(body);
            break;
          default:
            throw new Error('invalid action');
        }

        res.status(200).json({ success: result });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ success: false, error: error.message });
        }
      }
    });

    /**
     * 유저 아이디로 포인트 목록 조회
     */
    // this.router.get('/:userId/list', convertUUIDInRequestParam, async (req, res) => {
    this.router.get('/:userId/list', this.authService.checkAuth, async (req, res) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(userId);
        const pointList = await this.pointService.getPointByUserId(userId);
        res.status(200).json({ success: true, pointList });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ success: false, error: error.message });
        }
      }
    });

    /**
     * 유저 아이디로 총 포인트 조회
     */
    // this.router.get('/:userId/total', convertUUIDInRequestParam, async (req, res) => {
    this.router.get('/:userId/total', this.authService.checkAuth, async (req, res) => {
      try {
        const { userId } = req.params;
        await this.permissionService.mustBeAdmin(userId);
        const totalPoint = await this.pointService.getTotalPointByUserId(userId);
        res.status(200).json({ success: true, totalPoint });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ success: false, error: error.message });
        }
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
