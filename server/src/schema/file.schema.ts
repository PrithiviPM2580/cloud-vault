import { z } from "zod";
import type { InferSchemas } from "zod-express-validator";

const fileSchema = z.object({
  folderId: z.string().nullable(),
  id: z.string(),
  name: z.string(),
  size: z.bigint(),
  createdAt: z.date(),
  updatedAt: z.date(),
  originalName: z.string(),
  mimeType: z.string(),
  s3Key: z.string(),
  ownerId: z.string(),
  isTrashed: z.boolean(),
  trashedAt: z.date().nullable(),
});

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalFiles: z.number(),
  totalPages: z.number(),
});

const fileSortSchema = z.enum([
  "name_asc",
  "name_desc",
  "date_asc",
  "date_desc",
  "size_asc",
  "size_desc",
]);

export const uploadFilesSchema = {
  body: z.object({
    folderId: z.uuid().nullable().optional(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
};

export const getFilesSchema = {
  query: z.object({
    folderId: z.uuid().optional(),
    search: z.string().optional(),
    sort: z
      .enum([
        "name_asc",
        "name_desc",
        "date_asc",
        "date_desc",
        "size_asc",
        "size_desc",
      ])
      .default("name_asc"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      files: z.array(fileSchema),
      pagination: paginationSchema,
    }),
  }),
};

export const getFilePreviewUrlSchema = {
  params: z.object({
    id: z.string(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      file: fileSchema,
      url: z.string(),
    }),
  }),
};

export type UploadFilesInput = InferSchemas<typeof uploadFilesSchema>;
export type GetFilesQuery = InferSchemas<typeof getFilesSchema>;
export type GetFilePreviewUrlInput = InferSchemas<
  typeof getFilePreviewUrlSchema
>;

export type FileSort = z.infer<typeof fileSortSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
