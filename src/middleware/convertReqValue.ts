import { NextFunction, Request, Response } from 'express';
import { convertUUIDOfObject } from '../utils/uuid';

/**
 * request body의 모든 uuid 값을 인덱스를 사용하기 위해 변경하는 미들웨어
 */
export function convertUUIDToUseIndex(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;
  convertUUIDOfObject(body);
  next();
}
