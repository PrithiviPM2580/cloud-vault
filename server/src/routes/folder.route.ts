import {
  createFolderValidator,
  getFoldersValidator,
} from "@/validator/folder.validator";
import { Router } from "express";
import * as folderController from "@/controllers/folder.controller";
import { requireAuth } from "@/middlewares/require-auth.middleware";

const folderRouter = Router();

folderRouter
  .route("/")
  .post(requireAuth, createFolderValidator, folderController.createFolder);

folderRouter
  .route("/")
  .get(requireAuth, getFoldersValidator, folderController.getFolders);
export default folderRouter;
