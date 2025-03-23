import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { llms } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.query.llms.findMany({
      orderBy: [desc(llms.created_date)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newLLM] = await db.insert(llms)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(newLLM);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
