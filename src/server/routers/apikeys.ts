import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { createHash, randomBytes } from "node:crypto";

function generateSecureToken() {
  // Generate 32 random bytes and convert to a hex string
  const randomString = randomBytes(32).toString('hex');

  // Create a hash of the random string for additional security
  const hash = createHash('sha256').update(randomString).digest('hex');

  // Return a prefix followed by the first 32 characters of the hash
  return `llmt_${hash.substring(0, 32)}`;
}

export const apiKeysRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.apiKeys.findMany({
      where: (apiKeys, { eq }) => eq(apiKeys.userId, ctx.user?.userId || ''),
    });
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const apiKeyString = generateSecureToken();

    return await db.insert(apiKeys).values({
      key: apiKeyString,
      userId: ctx.user?.userId || '',
    }).returning();
  }),
});
