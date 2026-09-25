import { requireAuth } from "@/middlewares/require-auth.middleware";
import {
  getFilesValidator,
  uploadFilesValidator,
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

export default fileRouter;
