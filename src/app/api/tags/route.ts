import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { tags } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.query.tags.findMany({
      orderBy: [desc(tags.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
