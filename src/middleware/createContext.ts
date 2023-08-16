import { NextFunction, Request, Response } from 'express';
import { Context } from '../context';

export function createContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = new Context();
    req.context = context;
    next();
  };
}
