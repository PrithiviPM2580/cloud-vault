import { Router, type Request, type Response } from "express";
import folderRouter from "./folder.route";
import fileRouter from "./file.route";
import trashRouter from "./trash.route";
import shareLinkRouter from "./share-link.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "App is running" });
});

router.get("/health", (_req: Request, res: Response) => {
  res.json({ message: "App is healthy" });
});

router.use("/api/folders", folderRouter);
router.use("/api/files", fileRouter);
router.use("/api/trash", trashRouter);
router.use("/api/shares", shareLinkRouter);

router.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
