import { z } from "zod";
import type { InferSchemas } from "zod-express-validator";

export const shareLinkSchema = z.object({
  resourceType: z.string(),
  resourceId: z.string(),
  permission: z.string(),
  expiresAt: z.date().nullable(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  token: z.string(),
  ownerId: z.string(),
  accessCount: z.number(),
});

export const createShareLinkSchema = {
  body: z.object({
    resourceType: z.enum(["file", "folder"]),
    resourceId: z.string().min(1, "Resource Id is required"),
    permission: z.string().min(1, "Permission is required"),
    expiresAt: z.string().optional(),
  }),
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      shareLink: shareLinkSchema,
      isExisting: z.boolean(),
    }),
  }),
};

export const getShareLinksSchema = {
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      shareLinks: z.array(shareLinkSchema),
    }),
  }),
};

export const accessShareLinkSchema = {
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),

  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      resourceType: z.enum(["file", "folder"]),
      file: z.any().optional(),
      folder: z.any().optional(),
      url: z.url().optional(),
      permission: z.string(),
      owner: z
        .object({
          id: z.string(),
          name: z.string(),
          email: z.email(),
        })
        .nullable(),
    }),
  }),
};

export const deleteShareLinkSchema = {
  params: z.object({
    id: z.string(),
  }),

  res: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
};

export type CreateShareLinkInput = InferSchemas<
  typeof createShareLinkSchema
>["body"];
export type AccessShareLinkParams = InferSchemas<
  typeof accessShareLinkSchema
>["params"];
export type AccessShareLinkResult = InferSchemas<
  typeof accessShareLinkSchema
>["res"]["data"];
export type DeleteShareLinkParams = InferSchemas<
  typeof deleteShareLinkSchema
>["params"];
