import { validateRquest } from "@/middlewares/request-validate.middleware";
import { getFilesSchema, uploadFilesSchema } from "@/schema/file.schema";

export const uploadFilesValidator = validateRquest(uploadFilesSchema);
export const getFilesValidator = validateRquest(getFilesSchema);

export type UploadFilesValidator = typeof uploadFilesSchema;
export type GetFilesValidator = typeof getFilesSchema;
