import type { Controller } from "@/types/index.type";
import { AppError } from "@/utils/app-error.util";
import type {
  GetFilePreviewUrlValidator,
  GetFilesValidator,
  MoveFileValidator,
  PermanentlyDeleteFileValidator,
  RenameFileValidator,
  RestoreFileValidator,
  SoftDeleteFileValidator,
  UploadFilesValidator,
} from "@/validator/file.validator";
import * as fileService from "@/services/file.service";
import { sendResponse } from "@/utils/send-response.util";

export const uploadFiles: Controller<UploadFilesValidator> = async (
  req,
  res,
) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw AppError.badRequest("No files uploaded");
  }

  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const files = await fileService.uploadFiles(req.files, userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Files uploaded successfully",
    data: files,
  });
};

export const getFiles: Controller<GetFilesValidator> = async (req, res) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const { files, pagination } = await fileService.getFiles(req.query, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Files retrieved successfully",
    data: {
      files,
      pagination,
    },
  });
};

export const getFilePreviewUrl: Controller<GetFilePreviewUrlValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const { file, url } = await fileService.getFilePreviewUrl(req.params, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "File preview URL retrieved successfully",
    data: {
      file,
      url,
    },
  });
};

export const renameFile: Controller<RenameFileValidator> = async (req, res) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const files = await fileService.renameFile(req.params, req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "File renamed successfully",
    data: files,
  });
};

export const moveFile: Controller<MoveFileValidator> = async (req, res) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const files = await fileService.moveFile(req.params, req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "File moved successfully",
    data: files,
  });
};

export const softDeleteFile: Controller<SoftDeleteFileValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  await fileService.softDeleteFile(req.params, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "File deleted successfully",
  });
};

export const restoreFile: Controller<RestoreFileValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  await fileService.restoreFile(req.params, userId);

  sendResponse(res, {
    statusCode: 201,
    message: "File restored successfully",
  });
};

export const permanentlyDeleteFile: Controller<PermanentlyDeleteFileValidator> = async (req, res) => {

  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  await fileService.permanentlyDeleteFile(req.params, userId);

  sendResponse(res, {
    statusCode: 200,
    message: "File permanently deleted successfully",
  });
}