import type { getSessionFromRequest } from "@/utils/auth.util";

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof getSessionFromRequest>>
>;

declare global {
  namespace Express {
    interface Request {
      session?: AuthSession;
    }
  }
}

export {};
