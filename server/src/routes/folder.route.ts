import {
  createFolderValidator,
  getFolderDetailsValidator,
  getFoldersValidator,
  moveFolderValidator,
  renameFolderValidator,
  softDeleteFolderValidator,
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
  .route("/:id")
  .get(
    requireAuth,
    getFolderDetailsValidator,
    folderController.getFolderDetails,
  );

folderRouter
  .route("/:id/rename")
  .patch(requireAuth, renameFolderValidator, folderController.renameFolder);

folderRouter
  .route("/:id/move")
  .patch(requireAuth, moveFolderValidator, folderController.moveFolder);

folderRouter
  .route("/:id")
  .delete(
    requireAuth,
    softDeleteFolderValidator,
    folderController.softDeleteFolder,
  );
export default folderRouter;
