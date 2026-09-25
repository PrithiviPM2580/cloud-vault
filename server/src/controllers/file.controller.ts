import type { Controller } from "@/types/index.type";
import { AppError } from "@/utils/app-error.util";
import type {
  GetFilesValidator,
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
  const user = req.session?.user;

  if (!user) {
    throw AppError.unauthorized("User not authorized");
  }

  const files = await fileService.uploadFiles(req.files, user, req.body);

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
