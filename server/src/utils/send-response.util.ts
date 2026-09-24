import type { Response } from "express";

interface SendResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  { statusCode = 200, message = "Success", data }: SendResponse<T>,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
