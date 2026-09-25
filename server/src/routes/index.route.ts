import { Router } from "express";
import folderRouter from "./folder.route";
import fileRouter from "./file.route";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "App is running" });
});

router.get("/health", (_req, res) => {
  res.json({ message: "App is healthy" });
});

router.use("/api/folders", folderRouter);
router.use("/api/files", fileRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
