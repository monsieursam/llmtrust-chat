import { NextResponse } from 'next/server';
import { db } from '@/db';
import { credits } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/credits
 * Returns the current credit balance for the authenticated user
 */
export async function GET() {
  try {
    // Get the authenticated user ID
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all credit transactions for the user
    const creditTransactions = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, user.userId))
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

    return NextResponse.json(currentBalance, { status: 200 });
  } catch (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
