import status from "http-status";
import { ERROR_CODE } from "./constant.util";
import type { ErrorCode } from "@/types/index.type";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = status.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode = ERROR_CODE.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.BAD_REQUEST,
  ) {
    return new AppError(message, status.BAD_REQUEST, errorCode);
  }

  static unauthorized(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.ACCESS_UNAUTHORIZED,
  ) {
    return new AppError(message, status.UNAUTHORIZED, errorCode);
  }

  static forbidden(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.ACCESS_FORBIDDEN,
  ) {
    return new AppError(message, status.FORBIDDEN, errorCode);
  }

  static notFound(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.RESOURCE_NOT_FOUND,
  ) {
    return new AppError(message, status.NOT_FOUND, errorCode);
  }

  static conflict(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.RESOURCE_CONFLICT,
  ) {
    return new AppError(message, status.CONFLICT, errorCode);
  }

  static tooManyRequests(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.TOO_MANY_REQUESTS,
  ) {
    return new AppError(message, status.TOO_MANY_REQUESTS, errorCode);
  }

  static internalServerError(
    message: string,
    errorCode: ErrorCode = ERROR_CODE.INTERNAL_SERVER_ERROR,
  ) {
    return new AppError(message, status.INTERNAL_SERVER_ERROR, errorCode);
  }
}
