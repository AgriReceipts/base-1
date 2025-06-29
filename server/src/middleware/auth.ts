import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../utils/helpers';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded &&
      'role' in decoded
    ) {
      req.user = decoded as {id: string; role: string};
      next();
    } else {
      return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
  } catch (error) {
    return res
      .status(401)
      .json({message: 'Unauthorized: Can not verify jwt token'});
  }
};
