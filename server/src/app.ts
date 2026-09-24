import express, { type Application } from "express";
import { toNodeHandler } from "better-auth/node";
import router from "./routes/index.route";
import cookieParser from "cookie-parser";
import { auth } from "@/lib/auth.lib";
import morgan from "morgan";
import cors from "cors";
import { globalError } from "./middlewares/global-error.middleware";

const app: Application = express();

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));

app.use(router);

app.use(globalError);

export default app;
