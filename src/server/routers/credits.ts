import { protectedProcedure, router } from "../trpc";
import { credits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const creditsRouter = router({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user?.userId || '';

      // Fetch all credit transactions for the user
      const creditTransactions = await ctx
        .readDb
        .select()
        .from(credits)
        .where(eq(credits.userId, userId))
        .orderBy(desc(credits.createdAt));

      // Calculate the current balance
      const currentBalance = Number(
        creditTransactions.reduce((balance, credit) => {
          const amount = Number(credit.amount);
          if (credit.type === 'credit') {
            return Number((balance + amount).toFixed(2));
          }
          return Number((balance - amount).toFixed(2));
        }, 0).toFixed(2)
      );

      return currentBalance;
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      throw error;
    }
  }),
});
