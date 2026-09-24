import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth.lib";
import type { Request } from "express";

export const getSessionFromRequest = async (req: Request) => {
  return await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
};
