import { Router } from "express";

import { supabase } from "../lib/supabase";
import { authMiddleware } from "../middlewares/auth";

type PortfolioRow = {
  type: string;
  quantity: number;
  price: number;
};

const homeRouter = Router();

function roundToTwo(value: number): number {
  return Number(value.toFixed(2));
}

homeRouter.get("/summary", authMiddleware, async (_req, res) => {
  const user = res.locals.user as { id: string };

  const { data, error } = await supabase
    .from("portfolio_assets")
    .select("type, quantity, price")
    .eq("user_id", user.id);

  if (error) {
    res.status(500).json({ message: "Could not load portfolio summary." });
    return;
  }

  const assets = (data ?? []) as PortfolioRow[];
  let total = 0;
  let stocks = 0;
  let fiis = 0;

  for (const asset of assets) {
    const positionValue = Number(asset.quantity) * Number(asset.price);
    total += positionValue;

    const normalizedType = asset.type.trim().toLowerCase();
    if (normalizedType === "acao" || normalizedType === "acoes") {
      stocks += positionValue;
    } else if (normalizedType === "fii" || normalizedType === "fiis") {
      fiis += positionValue;
    }
  }

  const stockPercentage = total > 0 ? (stocks / total) * 100 : 0;
  const fiiPercentage = total > 0 ? (fiis / total) * 100 : 0;

  res.status(200).json({
    totalPatrimony: roundToTwo(total),
    stocksPercentage: roundToTwo(stockPercentage),
    fiisPercentage: roundToTwo(fiiPercentage)
  });
});

export { homeRouter };
