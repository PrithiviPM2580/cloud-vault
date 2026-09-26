import { createShareLinkValidator } from "@/validator/share-link.validator";
import { Router } from "express";
import * as shareLinkController from "@/controllers/share-link.controller";

const shareLinkRouter = Router();

shareLinkRouter.get(
  "/",
  createShareLinkValidator,
  shareLinkController.createShareLink,
);

export default shareLinkRouter;
