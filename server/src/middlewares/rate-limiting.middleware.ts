import { ipKeyGenerator, type Options, rateLimit } from "express-rate-limit";
import { appConfig } from "@/config/app.config";
import type { Request } from "express";

const keyGenerator = (req: Request) => {
  if (req.session?.user.id) {
    return req.session.user.id.toString();
  }
  return ipKeyGenerator(req.ip ?? "");
};

const commonOptions = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator,
  message: {
    statusCode: 429,
    errorCode: "TOO_MANY_REQUESTS",
    message: "Too many requests, please try again later.",
  },
} satisfies Partial<Options>;

export const generalRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  limit: 100,
  skip: () => appConfig.NODE_ENV === "development",
});

export const strictRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skip: () => appConfig.NODE_ENV === "development",
});
