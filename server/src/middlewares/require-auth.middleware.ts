import type { Request, Response, NextFunction } from "express";
import { getSessionFromRequest } from "@/utils/auth.util";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.session = session;

    next();
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
