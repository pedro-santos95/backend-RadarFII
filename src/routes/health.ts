import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend-radarfii",
    timestamp: new Date().toISOString()
  });
});

export { healthRouter };
