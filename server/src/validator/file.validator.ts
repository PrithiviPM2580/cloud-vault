import { validateRquest } from "@/middlewares/request-validate.middleware";
import { uploadFilesSchema } from "@/schema/file.schema";

export const uploadFilesValidator = validateRquest(uploadFilesSchema);

export type UploadFilesValidator = typeof uploadFilesSchema;
