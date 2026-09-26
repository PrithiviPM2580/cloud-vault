import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  getFilePreviewUrlSchema,
  getFilesSchema,
  moveFileSchema,
  renameFileSchema,
  restoreFileSchema,
  softDeleteFileSchema,
  uploadFilesSchema,
} from "@/schema/file.schema";

export const uploadFilesValidator = validateRquest(uploadFilesSchema);
export const getFilesValidator = validateRquest(getFilesSchema);
export const getFilePreviewUrlValidator = validateRquest(
  getFilePreviewUrlSchema,
);
export const renameFileValidator = validateRquest(renameFileSchema);
export const moveFileValidator = validateRquest(moveFileSchema);
export const softDeleteFileValidator = validateRquest(softDeleteFileSchema);
export const restoreFileValidator = validateRquest(restoreFileSchema);

export type UploadFilesValidator = typeof uploadFilesSchema;
export type GetFilesValidator = typeof getFilesSchema;
export type GetFilePreviewUrlValidator = typeof getFilePreviewUrlSchema;
export type RenameFileValidator = typeof renameFileSchema;
export type MoveFileValidator = typeof moveFileSchema;
export type SoftDeleteFileValidator = typeof softDeleteFileSchema;
export type RestoreFileValidator = typeof restoreFileSchema;
