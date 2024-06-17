import { z } from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// * c: variable means context (ctx)
// * between path and callback function is middleware
app.get("/hello", clerkMiddleware(), (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      error: "Unauthenticated",
    });
  }

  return c.json({
    message: "Hello Next.js!",
    userId: auth.userId,
  });
});

export const GET = handle(app);
export const POST = handle(app);