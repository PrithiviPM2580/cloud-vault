import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  getFilePreviewUrlSchema,
  getFilesSchema,
  renameFileSchema,
  uploadFilesSchema,
} from "@/schema/file.schema";

export const uploadFilesValidator = validateRquest(uploadFilesSchema);
export const getFilesValidator = validateRquest(getFilesSchema);
export const getFilePreviewUrlValidator = validateRquest(
  getFilePreviewUrlSchema,
);
export const renameFileValidator = validateRquest(renameFileSchema);

export type UploadFilesValidator = typeof uploadFilesSchema;
export type GetFilesValidator = typeof getFilesSchema;
export type GetFilePreviewUrlValidator = typeof getFilePreviewUrlSchema;
export type RenameFileValidator = typeof renameFileSchema;
