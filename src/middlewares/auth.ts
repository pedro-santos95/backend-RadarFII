import { NextFunction, Request, Response } from "express";

import { supabase } from "../lib/supabase";

function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ message: "Missing or invalid bearer token." });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ message: "Invalid or expired token." });
    return;
  }

  res.locals.user = data.user;
  res.locals.token = token;
  next();
}

export { authMiddleware };
