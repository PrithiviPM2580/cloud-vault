import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  createFolderSchema,
  getFolderDetailsSchema,
  getFoldersSchema,
  moveFolderSchema,
  renameFolderSchema,
  restoreFolderSchema,
  softDeleteFolderSchema,
} from "@/schema/folder.schema";

export const createFolderValidator = validateRquest(createFolderSchema);
export const getFoldersValidator = validateRquest(getFoldersSchema);
export const getFolderDetailsValidator = validateRquest(getFolderDetailsSchema);
export const renameFolderValidator = validateRquest(renameFolderSchema);
export const moveFolderValidator = validateRquest(moveFolderSchema);
export const softDeleteFolderValidator = validateRquest(softDeleteFolderSchema);
export const restoreFolderValidator = validateRquest(restoreFolderSchema);

export type CreateFolderValidator = typeof createFolderSchema;
export type GetFoldersValidator = typeof getFoldersSchema;
export type GetFolderDetailsValidator = typeof getFolderDetailsSchema;
export type RenameFolderValidator = typeof renameFolderSchema;
export type MoveFolderValidator = typeof moveFolderSchema;
export type SoftDeleteValidator = typeof softDeleteFolderSchema;
export type RestoreFolderValidator = typeof restoreFolderSchema;
