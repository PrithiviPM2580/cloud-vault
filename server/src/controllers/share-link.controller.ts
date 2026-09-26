import type { Controller } from "@/types/index.type";
import { AppError } from "@/utils/app-error.util";
import type { CreateShareLinkValidator } from "@/validator/share-link.validator";
import * as shareLinkService from "@/services/share-link.service";
import { sendResponse } from "@/utils/send-response.util";

export const createShareLink: Controller<CreateShareLinkValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const { shareLink, isExisting } = await shareLinkService.createShareLink(
    req.body,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    message: isExisting
      ? "Share link already exists"
      : "Share link created successfully",
    data: {
      shareLink,
      isExisting,
    },
  });
};
