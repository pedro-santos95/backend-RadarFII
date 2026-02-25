import { Router } from "express";
import { z } from "zod";

import { supabase } from "../lib/supabase";
import { authMiddleware } from "../middlewares/auth";

const usersRouter = Router();

const preferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  language: z.string().trim().min(2).max(10).optional(),
  notificationsEnabled: z.boolean().optional()
});

usersRouter.get("/preferences", authMiddleware, async (_req, res) => {
  const user = res.locals.user as { id: string };

  const { data, error } = await supabase
    .from("user_preferences")
    .select("theme, language, notifications_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    res.status(500).json({ message: "Could not load user preferences." });
    return;
  }

  if (!data) {
    res.status(200).json({
      preferences: {
        theme: "light",
        language: "pt-BR",
        notificationsEnabled: true
      }
    });
    return;
  }

  res.status(200).json({
    preferences: {
      theme: data.theme,
      language: data.language,
      notificationsEnabled: data.notifications_enabled
    }
  });
});

usersRouter.put("/preferences", authMiddleware, async (req, res) => {
  const parsedBody = preferencesSchema.safeParse(req.body);
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
    .from("user_preferences")
    .upsert(
      {
        user_id: user.id,
        theme: payload.theme ?? "light",
        language: payload.language ?? "pt-BR",
        notifications_enabled: payload.notificationsEnabled ?? true
      },
      { onConflict: "user_id" }
    )
    .select("theme, language, notifications_enabled")
    .single();

  if (error) {
    res.status(500).json({ message: "Could not save user preferences." });
    return;
  }

  res.status(200).json({
    message: "Preferences saved successfully.",
    preferences: {
      theme: data.theme,
      language: data.language,
      notificationsEnabled: data.notifications_enabled
    }
  });
});

export { usersRouter };
