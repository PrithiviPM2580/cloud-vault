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

export type CreateShareLinkInput = InferSchemas<
  typeof createShareLinkSchema
>["body"];
