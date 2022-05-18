import { NextFunction, Request, Response } from 'express';
import jwt from '../utils/jwt';

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      throw new Error(`authorization isn't exist`);
    }

    const decoded = jwt.verify(req.headers.authorization);
    const { success, email, error, password } = decoded;

    if (success) {
      if (!email) throw new Error('이메일이 존재하지 않습니다.');
      if (!password) throw new Error('암호가 존재하지 않습니다.');
      req.decoded = { success, email, password };
      next();
    } else if (error) {
      throw new Error(error);
    }
  } catch (error) {
    const err = error as Error;
    const message =
      err.name === 'TokenExpiredError'
        ? '토큰이 만료되었습니다.'
        : '코튼이 유효하지 않습니다.';
    return res.status(403).json({ success: false, error: message });
  }
}
