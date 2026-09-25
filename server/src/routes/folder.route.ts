import {
  createFolderValidator,
  getFolderDetailsValidator,
  getFoldersValidator,
  moveFolderValidator,
  permanentDeleteFolderValidator,
  renameFolderValidator,
  restoreFolderValidator,
  softDeleteFolderValidator,
} from "@/validator/folder.validator";
import { Router } from "express";
import * as folderController from "@/controllers/folder.controller";
import { requireAuth } from "@/middlewares/require-auth.middleware";

const folderRouter = Router();

folderRouter.post(
  "/",
  requireAuth,
  createFolderValidator,
  folderController.createFolder,
);

folderRouter.get(
  "/",
  requireAuth,
  getFoldersValidator,
  folderController.getFolders,
);

folderRouter.get(
  "/:id",
  requireAuth,
  getFolderDetailsValidator,
  folderController.getFolderDetails,
);

folderRouter.patch(
  "/:id/rename",
  requireAuth,
  renameFolderValidator,
  folderController.renameFolder,
);

folderRouter.patch(
  "/:id/move",
  requireAuth,
  moveFolderValidator,
  folderController.moveFolder,
);

folderRouter.delete(
  "/:id",
  requireAuth,
  softDeleteFolderValidator,
  folderController.softDeleteFolder,
);

folderRouter.patch(
  "/:id/restore",
  requireAuth,
  restoreFolderValidator,
  folderController.restoreFolder,
);

folderRouter.delete(
  "/:id/permanent",
  requireAuth,
  permanentDeleteFolderValidator,
  folderController.permanentDeleteFolder,
);
export default folderRouter;
