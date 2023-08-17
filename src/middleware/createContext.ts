import { NextFunction, Request, Response } from 'express';
import { Context } from '../context';
import { initTypeOrmDataSource, setTypeOrmDataSource } from '../db';

export async function createContext(req: Request, res: Response, next: NextFunction) {
  const context = new Context();
  req.context = context;
  const dataSource = await initTypeOrmDataSource();
  setTypeOrmDataSource(context, dataSource);
  next();
}
