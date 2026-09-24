import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  createFolderSchema,
  getFolderDetailsSchema,
  getFoldersSchema,
  renameFolderSchema,
} from "@/schema/folder.schema";

export const createFolderValidator = validateRquest(createFolderSchema);
export const getFoldersValidator = validateRquest(getFoldersSchema);
export const getFolderDetailsValidator = validateRquest(getFolderDetailsSchema);
export const renameFolderValidator = validateRquest(renameFolderSchema);

export type CreateFolderValidator = typeof createFolderSchema;
export type GetFoldersValidator = typeof getFoldersSchema;
export type GetFolderDetailsValidator = typeof getFolderDetailsSchema;
export type RenameFolderValidator = typeof renameFolderSchema;
