// import { NextFunction, Request, Response } from 'express';
// import { convertUUIDOfObject } from '../utils/uuid';

import { NextFunction, Request, Response } from 'express';
import { convertUUID, convertUUIDOfObject } from '../utils/uuid';

/**
 * request body의 모든 uuid 값을 인덱스 성능을 높이는 형태로 변경
 */
export function convertUUIDInRequestBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body) {
    convertUUIDOfObject(req.body);
  }
  next();
}

/**
 * request params의 모든 uuid 값을 인덱스 성능을 높이는 형태로 변경
 */
export function convertUUIDInRequestParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.params) {
    convertUUIDOfObject(req.params);
  }
  next();
}