import type {Request, Response, NextFunction} from 'express';
import {flushAllCache} from '../services/cache/cacheService';

export function invalidateAllCache() {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        flushAllCache().catch(console.error);
      }
    });

    next();
  };
}
