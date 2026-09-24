import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

router.get("/health", (req, res) => {
  res.json({ message: "App is healthy" });
});

export default router;
