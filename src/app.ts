import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { healthRouter } from "./routes/health";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRouter);

export { app };
