import type { SessionUser } from "@meta-1/nest-security";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
