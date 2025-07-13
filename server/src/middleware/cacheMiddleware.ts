// import type {Request, Response, NextFunction} from 'express';
// import {getCached, setCache} from '../services/cache/cacheService';

// export function cacheMiddleware(ttlSeconds = 300) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     if (req.method !== 'GET') return next();

//     const key = `cache:${req.originalUrl}`; //include route and query

//     const cached = await getCached(key);

//     if (cached) {
//       return res.json(cached);
//     }

//     const originalJson = res.json.bind(res);

//     res.json = (body) => {
//       setCache(key, body, ttlSeconds).catch(console.error);
//       return originalJson(body);
//     };

//     next();
//   };
// }
