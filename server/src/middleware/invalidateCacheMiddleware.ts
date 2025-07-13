// import type {Request, Response, NextFunction} from 'express';
// import {flushReceiptCache} from '../services/cacheService';

// export function invalidateReceiptCache() {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     res.on('finish', () => {
//       if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
//         flushReceiptCache().catch(console.error);
//       }
//     });

//     next();
//   };
// }
