import type { Controller } from "@/types/index.type";
import type {
  CreateFolderValidator,
  GetFoldersValidator,
} from "@/validator/folder.validator";
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

export const getFolders: Controller<GetFoldersValidator> = async (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const folders = await folderService.getFolders(req.query, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Folders retrieved successfully",
    data: folders,
  });
};
