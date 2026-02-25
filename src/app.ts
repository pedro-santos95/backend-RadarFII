import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { homeRouter } from "./routes/home";
import { portfolioRouter } from "./routes/portfolio";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/portfolio", portfolioRouter);

export { app };
