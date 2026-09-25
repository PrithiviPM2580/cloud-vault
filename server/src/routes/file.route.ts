import { requireAuth } from "@/middlewares/require-auth.middleware";
import {
  getFilesValidator,
  uploadFilesValidator,
  getFilePreviewUrlValidator,
} from "@/validator/file.validator";
import * as fileController from "@/controllers/file.controller";
import { Router } from "express";

const fileRouter = Router();

fileRouter.post(
  "/upload",
  requireAuth,
  uploadFilesValidator,
  fileController.uploadFiles,
);

fileRouter.get("/", requireAuth, getFilesValidator, fileController.getFiles);

fileRouter.get(
  "/:id/preview",
  requireAuth,
  getFilePreviewUrlValidator,
  fileController.getFilePreviewUrl,
);

export default fileRouter;
