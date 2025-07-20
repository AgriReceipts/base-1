import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../utils/helpers'; // Assuming you have this helper

// Extend the Express Request type to include the 'user' property if not already done
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        username: string;
        committee: {
          id: string;
          name: string;
        };
      };
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Read the token from the httpOnly cookie instead of the header
  const token = req.cookies.auth_token;

  // 2. Check if the cookie token exists
  if (!token) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

  try {
    // 3. Verify the token (your existing logic is fine)
    const decoded = verifyToken(token);

    // 4. Check if the decoded payload is valid and attach it to the request
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded &&
      'role' in decoded &&
      'username' in decoded &&
      'committee' in decoded
    ) {
      req.user = decoded as {
        id: string;
        role: string;
        username: string;
        committee: {
          id: string;
          name: string;
        };
      };
      next();
    } else {
      return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
  } catch (error) {
    // This will catch errors from verifyToken (e.g., expired, malformed)
    return res
      .status(401)
      .json({message: 'Unauthorized: Can not verify jwt token'});
  }
};
