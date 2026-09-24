import { validateRquest } from "@/middlewares/request-validate.middleware";
import { createFolderSchema } from "@/schema/folder.schema";

export const createFolderValidator = validateRquest(createFolderSchema);

export type CreateFolderValidator = typeof createFolderSchema;