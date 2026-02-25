import axios from "axios";
import { Router } from "express";
import { z } from "zod";

import { fetchAssetData } from "../adapters/marketDataAdapter";
import { fetchNewsByTicker } from "../adapters/newsAdapter";
import { analyzeAsset } from "../services/assetAnalysisService";

const assetsRouter = Router();

const paramsSchema = z.object({
  ticker: z.string().trim().min(3).max(12)
});

assetsRouter.get("/:ticker/analyze", async (req, res) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({
      message: "Invalid ticker parameter.",
      issues: parsedParams.error.flatten()
    });
    return;
  }

  const ticker = parsedParams.data.ticker.toUpperCase();

  try {
    const assetData = await fetchAssetData(ticker);
    const report = analyzeAsset(assetData);

    res.status(200).json({
      report
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).json({ message: "Asset not found in external provider." });
      return;
    }

    if (error instanceof Error && error.message.includes("MARKET_DATA_API_BASE_URL")) {
      res.status(500).json({ message: "Market data provider not configured." });
      return;
    }

    res.status(502).json({ message: "Could not fetch asset data from external provider." });
  }
});

assetsRouter.get("/:ticker/news", async (req, res) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({
      message: "Invalid ticker parameter.",
      issues: parsedParams.error.flatten()
    });
    return;
  }

  const ticker = parsedParams.data.ticker.toUpperCase();

  try {
    const items = await fetchNewsByTicker(ticker);
    const news = items.map((item) => ({
      title: item.title,
      source: item.source ?? "Unknown",
      publishedAt: item.publishedAt ?? null,
      url: item.url
    }));

    res.status(200).json({ ticker, news });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(200).json({ ticker, news: [] });
      return;
    }

    if (error instanceof Error && error.message.includes("NEWS_API_BASE_URL")) {
      res.status(500).json({ message: "News provider not configured." });
      return;
    }

    res.status(502).json({ message: "Could not fetch news from external provider." });
  }
});

export { assetsRouter };
