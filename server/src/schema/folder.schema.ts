import type { InferSchemas } from "zod-express-validator";
import { z } from "zod";

export const folderSchema = z.object({
  name: z.string(),
  parentId: z.string().nullable(),
  path: z.array(z.string()),
  id: z.string(),
  ownerId: z.string(),
  isTrashed: z.boolean(),
  trashedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createFolderSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Folder name is required."),
    parentId: z.uuid().nullable().optional(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: folderSchema,
  }),
};

export type CreateFolderInput = InferSchemas<typeof createFolderSchema>;
