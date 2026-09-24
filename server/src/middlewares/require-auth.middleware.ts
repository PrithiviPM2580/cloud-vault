import type { Request, Response, NextFunction } from "express";
import { getSessionFromRequest } from "@/utils/auth.util";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.session = session;

    next();
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
