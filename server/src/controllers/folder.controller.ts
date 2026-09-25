import type { Controller } from "@/types/index.type";
import type {
  CreateFolderValidator,
  GetFolderDetailsValidator,
  GetFoldersValidator,
  MoveFolderValidator,
  RenameFolderValidator,
  SoftDeleteValidator,
} from "@/validator/folder.validator";
import * as folderService from "@/services/folder.service";
import { AppError } from "@/utils/app-error.utils";
import { sendResponse } from "@/utils/send-response.util";
import { APIError } from "better-auth";

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

export const getFolderDetails: Controller<GetFolderDetailsValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const { folder, breadcrumbs } = await folderService.getFolderDetails(
    req.params,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Folder details retrieved successfully",
    data: {
      folder,
      breadcrumbs,
    },
  });
};

export const renameFolder: Controller<RenameFolderValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const folder = await folderService.renameFolder(req.params, req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Folder renamed successfully",
    data: folder,
  });
};

export const moveFolder: Controller<MoveFolderValidator> = async (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const folder = await folderService.moveFolder(req.params, req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Folder moved successfully",
    data: folder,
  });
};

export const softDeleteFolder: Controller<SoftDeleteValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  await folderService.softDeleteFolder(req.params, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Folder deleted successfully",
  });
};
