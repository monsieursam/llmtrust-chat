import { db } from '@/db';
import { credits, llms } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Deduct credits from a user based on token usage and model pricing
 */
export async function deductCredits({
  userId,
  llmSlug,
  promptTokens,
  completionTokens,
}: {
  userId: string;
  llmSlug: string;
  promptTokens: number;
  completionTokens: number;
}) {
  try {
    // Get the model pricing information
    const model = await db.query.llms.findFirst({
      where: eq(llms.slug, llmSlug),
    });

    if (!model) {
      throw new Error('Model not found');
    }

    // Calculate the cost based on token usage and model pricing
    const promptCost = model.pricing_input
      ? Number(model.pricing_input) * (promptTokens / 1000)
      : 0;
    const completionCost = model.pricing_output
      ? Number(model.pricing_output) * (completionTokens / 1000)
      : 0;

    // Total cost for this request
    const totalCost = Number(promptCost + completionCost);

    if (totalCost <= 0) {
      return { success: true, cost: 0 };
    }

    // Insert a debit transaction
    await db.insert(credits).values({
      userId,
      amount: totalCost.toString(),
      type: 'debit',
    });

    return { success: true, cost: totalCost };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return { success: false, error };
  }
}

/**
 * Get the current credit balance for a user
 */
export async function getUserCreditBalance(userId: string) {
  try {
    // Fetch all credit transactions for the user
    const creditTransactions = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, userId))
      .orderBy(credits.createdAt);

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

    return { success: true, balance: currentBalance };
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return { success: false, balance: 0, error };
  }
}
