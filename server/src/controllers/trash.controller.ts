import type { Controller } from "@/types/index.type";
import { AppError } from "@/utils/app-error.util";
import type { GetTrashItemsValidator } from "@/validator/trash.validator";
import * as trashService from "@/services/trash.service";
import { sendResponse } from "@/utils/send-response.util";

export const getTrashItems: Controller<GetTrashItemsValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authorized");
  }

  const { files, folders } = await trashService.getTrashItems(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Trash items retrieved successfully",
    data: {
      files,
      folders,
    },
  });
};
