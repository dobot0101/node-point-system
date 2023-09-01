import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../error/errors';

export async function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    res.status(err.getStatusCode()).send({ error: err.message });
  } else {
    let errorMessage;
    if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = err as string;
    }
    res.status(500).json({ success: false, error: errorMessage });
  }
}
