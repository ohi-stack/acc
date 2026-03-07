import { NextFunction, Request, Response } from "express";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.path === "/health" || req.path === "/ready") {
    next();
    return;
  }

  const expected = process.env.API_KEY;
  if (!expected) {
    next();
    return;
  }

  const provided = req.header("x-api-key");
  if (provided !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
