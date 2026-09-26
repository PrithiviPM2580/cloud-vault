import { z } from "zod";
import { fileSchema } from "./file.schema";
import { folderSchema } from "./folder.schema";

export const getTrashItemsSchema = {
  res: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      files: z.array(fileSchema),
      folders: z.array(folderSchema),
    }),
  }),
};

export const emptyTrashSchema = {
  res: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
};
