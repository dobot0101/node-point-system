import express from 'express';
import { PointService } from '../services/point.service';

const router = express.Router();

const pointService = new PointService();

// {
//   "type": "REVIEW",
//   "action": "ADD", /* "MOD", "DELETE" */
//   "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
//   "content": "좋아요!",
//   "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-
//   851d-4a50-bb07-9cc15cbdc332"],
//   "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
//   "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
// }
router.post('/', async (req, res) => {
  try {
    const { body } = req;
    let result: boolean = false;

    switch (req.body.action) {
      case 'ADD':
        result = await pointService.add(body);
        break;
      case 'MOD':
        result = await pointService.modify(body);
        break;
      case 'DELETE':
        result = await pointService.delete(body);
        break;
    }
    res.status(200).send({ success: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

export default router;
