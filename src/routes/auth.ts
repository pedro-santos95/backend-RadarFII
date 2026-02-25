import { Router } from "express";
import { z } from "zod";

import { authMiddleware } from "../middlewares/auth";
import { supabase } from "../lib/supabase";

const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/register", async (req, res) => {
  const parsedBody = registerSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid payload.",
      issues: parsedBody.error.flatten()
    });
    return;
  }

  const { email, password } = parsedBody.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(201).json({
    message: "User registered successfully.",
    user: data.user,
    session: data.session
  });
});

authRouter.post("/login", async (req, res) => {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid payload.",
      issues: parsedBody.error.flatten()
    });
    return;
  }

  const { email, password } = parsedBody.data;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    res.status(401).json({ message: error?.message ?? "Authentication failed." });
    return;
  }

  res.status(200).json({
    message: "Login successful.",
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user
  });
});

authRouter.post("/logout", authMiddleware, async (req, res) => {
  // JWT access tokens are stateless; logout is effectively client-side token discard.
  // We validate the token so only authenticated users can call this endpoint.
  res.status(200).json({ message: "Logout successful." });
});

authRouter.get("/me", authMiddleware, async (_req, res) => {
  res.status(200).json({
    user: res.locals.user
  });
});

export { authRouter };
