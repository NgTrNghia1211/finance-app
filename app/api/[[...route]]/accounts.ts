import { Hono } from "hono";
import { z } from "zod";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json(
          {
            error: "Unauthenticated",
          },
          401
        ),
      });
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({
      data,
    });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json(
            {
              error: "Unauthenticated",
            },
            401
          ),
        });
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          name: values.name,
          userId: auth.userId,
        })
        .returning();

      return c.json({
        data,
      });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(403, {
          res: c.json(
            {
              error: "Unauthorized",
            },
            403
          ),
        });
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      return c.json({
        data,
      });
    }
  );

export default app;
