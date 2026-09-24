import { appConfig } from "@/config/app.config";
import { AppError } from "@/utils/app-error.utils";
import { ERROR_CODE } from "@/utils/constant.util";
import { formatError } from "@/utils/index.util";
import type { Request, Response, NextFunction } from "express";
import { status } from "http-status";
import { ZodError } from "zod";
import { RequestValidationError } from "zod-express-validator";

const isDevelopment = appConfig.NODE_ENV === "development";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

const getErrorStack = (err: unknown): string | undefined => {
  if (err instanceof Error) return err.stack;
  return undefined;
};

const getDevelopmentError = (err: unknown) => {
  return {
    message: getErrorMessage(err),
    stack: getErrorStack(err),
  };
};

export const globalError = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(status.BAD_REQUEST).json({
      ...getDevelopmentError(err),
      message: "Invalid JSON payload",
      errorCode: ERROR_CODE.BAD_REQUEST,
    });
  }

  if (err instanceof RequestValidationError) {
    return res.status(status.BAD_REQUEST).json({
      message: "Validation Error",
      errorCode: ERROR_CODE.VALIDATION_ERROR,
      errors: err.errors,
    });
  }

  if (err instanceof ZodError) {
    const issues = formatError(err.issues);
    return res.status(status.BAD_REQUEST).json({
      message: "Validation Error",
      errorCode: ERROR_CODE.VALIDATION_ERROR,
      errors: issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  return res.status(status.INTERNAL_SERVER_ERROR).json({
    message: isDevelopment ? getErrorMessage(err) : "Internal Server Error",
    errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
    ...(isDevelopment && { stack: getErrorStack(err) }),
  });
};
