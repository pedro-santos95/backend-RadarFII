import { Router } from "express";
import { z } from "zod";

import { supabase } from "../lib/supabase";
import { authMiddleware } from "../middlewares/auth";

const portfolioRouter = Router();

const createAssetSchema = z.object({
  ticker: z.string().trim().min(3).max(12),
  type: z.enum(["acao", "fii", "acoes", "fiis"]),
  date: z.string().date(),
  quantity: z.number().positive(),
  price: z.number().positive()
});

portfolioRouter.post("/assets", authMiddleware, async (req, res) => {
  const parsedBody = createAssetSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid payload.",
      issues: parsedBody.error.flatten()
    });
    return;
  }

  const user = res.locals.user as { id: string };
  const payload = parsedBody.data;

  const { data, error } = await supabase
    .from("portfolio_assets")
    .insert({
      user_id: user.id,
      ticker: payload.ticker.toUpperCase(),
      type: payload.type,
      purchase_date: payload.date,
      quantity: payload.quantity,
      price: payload.price
    })
    .select("*")
    .single();

  if (error) {
    res.status(500).json({ message: "Could not create portfolio asset." });
    return;
  }

  res.status(201).json({
    message: "Asset registered successfully.",
    asset: data
  });
});

export { portfolioRouter };
