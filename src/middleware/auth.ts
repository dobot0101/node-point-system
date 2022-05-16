import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error(`authorization isn't exist`);
    }

    const jwtSecret = process.env.JWT_SECRET || 'funnynode';
    req.decoded = jwt.verify(req.headers.authorization, jwtSecret);
    next();
  } catch (error) {
    if (error instanceof Error && error.name == 'TokenExpiredError') {
      return res.status(403).json({ success: false, error: 'token 만료' });
    }
    return res
      .status(403)
      .json({ success: false, error: 'token이 유효하지 않습니다.' });
  }
};


