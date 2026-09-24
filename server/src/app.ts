import express, { type Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth.lib";

const app: Application = express();

app.all("/api/auth/*", toNodeHandler(auth));

export default app;
