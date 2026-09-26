import {
  accessShareLinkValidator,
  createShareLinkValidator,
  getShareLinksValidator,
} from "@/validator/share-link.validator";
import { Router } from "express";
import * as shareLinkController from "@/controllers/share-link.controller";

const shareLinkRouter = Router();

shareLinkRouter.get(
  "/",
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

export default shareLinkRouter;
