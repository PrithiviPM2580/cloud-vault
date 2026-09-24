import {
  createFolderValidator,
  getFolderDetailsValidator,
  getFoldersValidator,
  moveFolderValidator,
  renameFolderValidator,
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

folderRouter
  .route("/:folderId")
  .get(
    requireAuth,
    getFolderDetailsValidator,
    folderController.getFolderDetails,
  );

folderRouter
  .route("/:folderId/rename")
  .patch(requireAuth, renameFolderValidator, folderController.renameFolder);

folderRouter
  .route("/:folderId/move")
  .patch(requireAuth, moveFolderValidator, folderController.moveFolder);
export default folderRouter;
