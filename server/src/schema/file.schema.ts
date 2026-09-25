import { z } from "zod";
import type { InferSchemas } from "zod-express-validator";

export const uploadFilesSchema = {
  body: z.object({
    folderId: z.uuid().nullable().optional(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
};

export type UploadFilesInput = InferSchemas<typeof uploadFilesSchema>;
