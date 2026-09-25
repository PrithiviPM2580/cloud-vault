import { AppError } from "@/utils/app-error.util";
import { MAX_FILE_COUNT, MAX_FILE_SIZE } from "@/utils/constant.util";
import type { RequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      AppError.badRequest(
        "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
      ),
    );
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILE_COUNT,
  },
});

export const uploadSingleFile = (fieldName: string): RequestHandler =>
  upload.single(fieldName);

export const uploadMultipleFiles = (fieldName: string): RequestHandler =>
  upload.array(fieldName, MAX_FILE_COUNT);

export const uploadFields = (
  fields: { name: string; maxCount?: number }[],
): RequestHandler => upload.fields(fields);
