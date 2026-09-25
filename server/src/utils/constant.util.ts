import type { FileSort } from "@/schema/file.schema";
import type { Prisma } from "@/generated/prisma/client";

export const ERROR_CODE = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED",
  ACCESS_FORBIDDEN: "ACCESS_FORBIDDEN",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
} as const;

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_FILE_COUNT = 10;

export const sortMap: Record<FileSort, Prisma.FileOrderByWithRelationInput> = {
  name_asc: { name: "asc" },
  name_desc: { name: "desc" },
  date_asc: { createdAt: "asc" },
  date_desc: { createdAt: "desc" },
  size_asc: { size: "asc" },
  size_desc: { size: "desc" },
};
