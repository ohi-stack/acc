import { NextFunction, Request, Response } from "express";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 120;

export function basicRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= LIMIT) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  entry.count += 1;
  next();
}
