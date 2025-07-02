import 'express';

declare global {
  namespace Express {
    export interface Request {
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
