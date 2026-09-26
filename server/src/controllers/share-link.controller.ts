import type { Controller } from "@/types/index.type";
import { AppError } from "@/utils/app-error.util";
import type {
  AccessShareLinkValidator,
  CreateShareLinkValidator,
  DeleteShareLinkValidator,
  GetShareLinksValidator,
} from "@/validator/share-link.validator";
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

export const getShareLinks: Controller<GetShareLinksValidator> = async (
  req,
  res,
) => {
  const userId = req.session?.user.id;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const shareLinks = await shareLinkService.getShareLinks(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Share links fetched successfully",
    data: {
      shareLinks,
    },
  });
};

export const accessShareLink: Controller<AccessShareLinkValidator> = async (
  req,
  res,
) => {
  const result = await shareLinkService.accessShareLink(req.params);

  sendResponse(res, {
    statusCode: 200,
    message: "Share link accessed successfully",
    data: result,
  });
};

export const deleteShareLink: Controller<DeleteShareLinkValidator> = async (req, res) => {

    const userId = req.session?.user.id;
    
    if (!userId) {
      throw AppError.unauthorized("User not authenticated");
    }

    await shareLinkService.deleteShareLink(req.params, userId);
    
    sendResponse(res, {
      statusCode: 200,
      message: "Share link deleted successfully",
    });
}
