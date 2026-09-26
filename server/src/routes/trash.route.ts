import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Router } from "express";
import * as trashController from "@/controllers/trash.controller";
import {
  emptyTrashValidator,
  getTrashItemsValidator,
} from "@/validator/trash.validator";

const trashRouter = Router();

trashRouter.get(
  "/",
  requireAuth,
  getTrashItemsValidator,
  trashController.getTrashItems,
);

trashRouter.post(
  "/empty",
  requireAuth,
  emptyTrashValidator,
  trashController.emptyTrash,
);

export default trashRouter;
