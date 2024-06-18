import { z } from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import accounts from "./accounts";
import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      error: "Internal server error",
    },
    500
  );
});

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

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
