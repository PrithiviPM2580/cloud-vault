import type { Controller } from "@/types/index.type";
import type { CreateFolderValidator } from "@/validator/folder.validator";
import * as folderService from "@/services/folder.service";
import { AppError } from "@/utils/app-error.utils";
import { sendResponse } from "@/utils/send-response.util";

export const createFolder: Controller<CreateFolderValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const folder = await folderService.createFolder(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    message: "Folder created successfully",
    data: folder,
  });
};
