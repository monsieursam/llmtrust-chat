import type { db, readDb } from "@/db";
import type { ClerkMiddlewareAuthObject } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";

interface Context {
  user: ClerkMiddlewareAuthObject | null;
  db: typeof db;
  readDb: typeof readDb;
}

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const { user } = ctx;

  if (!user?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
