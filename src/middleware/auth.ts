import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from '../utils/jwt';

interface JwtVerifyResult extends JwtPayload {
  email: string;
  password: string;
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      throw new Error(`authorization isn't exist`);
    }

    const decoded = jwt.verify(req.headers.authorization) as JwtVerifyResult;

    const { email, password } = decoded;
    if (!email) throw new Error(`email isn't exist`);
    if (!password) throw new Error(`password isn't exist`);

    req.decoded = decoded;
    next();
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return res.status(403).json({ success: false, error: err.message });
  }
}
