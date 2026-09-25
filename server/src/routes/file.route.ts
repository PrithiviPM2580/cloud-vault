import { requireAuth } from "@/middlewares/require-auth.middleware";
import {
  getFilesValidator,
  uploadFilesValidator,
  getFilePreviewUrlValidator,
  renameFileValidator,
  moveFileValidator,
  softDeleteFileValidator,
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

fileRouter.patch(
  "/:id/rename",
  requireAuth,
  renameFileValidator,
  fileController.renameFile,
);

fileRouter.patch(
  "/:id/move",
  requireAuth,
  moveFileValidator,
  fileController.moveFile,
);

fileRouter.delete(
  "/:id",
  requireAuth,
  softDeleteFileValidator,
  fileController.softDeleteFile,
);

export default fileRouter;
