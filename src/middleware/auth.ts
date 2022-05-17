import { NextFunction, Request, Response } from 'express';
import jwt from '../utils/jwt';

// interface AuthRequest extends Request {
//   decoded: string;
// }

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      throw new Error(`authorization isn't exist`);
    }
    const decoded = jwt.verify(req.headers.authorization);
    if (decoded) {
      req.decoded = decoded;
    }
    next();
  } catch (error) {
    if (error instanceof Error && error.name == 'TokenExpiredError') {
      return res
        .status(403)
        .json({ success: false, error: 'token이 만료되었습니다.' });
    }
    return res
      .status(403)
      .json({ success: false, error: 'token이 유효하지 않습니다.' });
  }
}
