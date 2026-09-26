import {
  accessShareLinkValidator,
  createShareLinkValidator,
  deleteShareLinkValidator,
  getShareLinksValidator,
} from "@/validator/share-link.validator";
import { Router } from "express";
import * as shareLinkController from "@/controllers/share-link.controller";
import { requireAuth } from "@/middlewares/require-auth.middleware";

const shareLinkRouter = Router();

shareLinkRouter.post(
  "/",
  requireAuth,
  createShareLinkValidator,
  shareLinkController.createShareLink,
);

shareLinkRouter.get(
  "/",
  getShareLinksValidator,
  shareLinkController.getShareLinks,
);

shareLinkRouter.get(
  "/access/:token",
  accessShareLinkValidator,
  shareLinkController.accessShareLink,
);

shareLinkRouter.delete(
  "/:id",
  requireAuth,
  deleteShareLinkValidator,
  shareLinkController.deleteShareLink,
);

export default shareLinkRouter;
