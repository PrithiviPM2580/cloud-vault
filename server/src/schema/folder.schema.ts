import type { InferSchemas } from "zod-express-validator";
import { z } from "zod";

const folderSchema = z.object({
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

const breadcrumbSchema = z.object({
  id: z.union([z.uuid(), z.null()]),
  name: z.string(),
});

export const getFolderDetailsSchema = {
  params: z.object({
    id: z.uuid(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      folder: folderSchema,
      breadcrumbs: z.array(breadcrumbSchema),
    }),
  }),
};

export const getFoldersSchema = {
  query: z.object({
    parentId: z.uuid().optional(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(folderSchema),
  }),
};

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
export type GetFoldersInput = InferSchemas<typeof getFoldersSchema>;
export type GetFolderDetailsInput = InferSchemas<typeof getFolderDetailsSchema>;

export type Breadcrumb = z.infer<typeof breadcrumbSchema>;
