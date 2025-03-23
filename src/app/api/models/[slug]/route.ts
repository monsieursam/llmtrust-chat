import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { llms } from '@/db/schema';

//Add promise to Params

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const data = await db
      .select()
      .from(llms)
      .where(eq(llms.slug, slug))

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const data = await db
      .update(llms)
      .set({ ...body })
      .where(eq(llms.slug, slug))

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const data = await db
      .delete(llms)
      .where(eq(llms.slug, slug))
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
