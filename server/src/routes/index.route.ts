import { Router } from "express";
import folderRouter from "./folder.route";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

router.get("/health", (req, res) => {
  res.json({ message: "App is healthy" });
});

router.use("/api/folders", folderRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
