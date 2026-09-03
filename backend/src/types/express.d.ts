import { jwtUserPayload } from './jwtUser.type.ts';

declare global {
  namespace Express {
    interface Request {
      user: jwtUserPayload;
    }
  }
}

export {};
