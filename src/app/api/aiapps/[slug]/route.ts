import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { aiApps } from '@/db/schema';

//Add promise to Params

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const data = await db.query.aiApps.findFirst({
      where: (aiApps, { eq }) => eq(aiApps.slug, slug)
    });

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
      .update(aiApps)
      .set({ ...body })
      .where(eq(aiApps.slug, slug))

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
      .delete(aiApps)
      .where(eq(aiApps.slug, slug))
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
