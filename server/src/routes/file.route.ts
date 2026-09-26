import { requireAuth } from "@/middlewares/require-auth.middleware";
import {
  getFilesValidator,
  uploadFilesValidator,
  getFilePreviewUrlValidator,
  renameFileValidator,
  moveFileValidator,
  softDeleteFileValidator,
  restoreFileValidator,
  permanentlyDeleteFileValidator,
} from "@/validator/file.validator";
import * as fileController from "@/controllers/file.controller";
import { Router } from "express";
import { uploadMultipleFiles } from "@/middlewares/multer.middleware";

const fileRouter = Router();

fileRouter.post(
  "/upload",
  requireAuth,
  uploadFilesValidator,
  uploadMultipleFiles("files"),
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

fileRouter.post(
  "/:id/restore",
  requireAuth,
  restoreFileValidator,
  fileController.restoreFile,
);

fileRouter.delete(
  "/:id/permanent",
  requireAuth,
  permanentlyDeleteFileValidator,
  fileController.permanentlyDeleteFile,
);

export default fileRouter;
