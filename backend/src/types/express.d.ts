import { UserPayload } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
