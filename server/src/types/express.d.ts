import 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: string;
        username: string;
        committee: string;
      };
    }
  }
}
