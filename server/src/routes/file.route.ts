import { requireAuth } from "@/middlewares/require-auth.middleware";
import { uploadFilesValidator } from "@/validator/file.validator";
import * as fileController from "@/controllers/file.controller";
import { Router } from "express";

const fileRouter = Router();

fileRouter
  .route("/upload")
  .post(requireAuth, uploadFilesValidator, fileController.uploadFiles);

export default fileRouter;
