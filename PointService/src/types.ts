// types.ts
import { Context } from './context';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      context: Context;
      // user?: UserPayload;
    }
  }
}
