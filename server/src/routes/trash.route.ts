import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Router } from "express";
import * as trashController from "@/controllers/trash.controller";
import { getTrashItemsValidator } from "@/validator/trash.validator";

const trashRouter = Router();

trashRouter.get(
  "/",
  requireAuth,
  getTrashItemsValidator,
  trashController.getTrashItems,
);

export default trashRouter;
