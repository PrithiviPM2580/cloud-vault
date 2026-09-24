import { validateRquest } from "@/middlewares/request-validate.middleware";
import { createFolderSchema, getFoldersSchema } from "@/schema/folder.schema";

export const createFolderValidator = validateRquest(createFolderSchema);
export const getFoldersValidator = validateRquest(getFoldersSchema);

export type CreateFolderValidator = typeof createFolderSchema;
export type GetFoldersValidator = typeof getFoldersSchema;
