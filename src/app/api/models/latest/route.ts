import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { llms } from '@/db/schema';

export async function GET() {
  try {
    const latestLlms = await db.query.llms.findMany({
      orderBy: [desc(llms.created_date)],
      limit: 3,
    });

    return NextResponse.json(latestLlms);
  } catch (error) {
    console.error('Error fetching latest LLMs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest LLMs' },
      { status: 500 }
    );
  }
}
