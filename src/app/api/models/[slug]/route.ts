import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { llms } from '@/db/schema';

//Add promise to Params

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const data = await db.query.llms.findFirst({
      where: (llms, { eq }) => eq(llms.slug, slug)
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
    const { createdAt, updatedAt, ...updateData } = body;
    const data = await db
      .update(llms)
      .set({ ...updateData })
      .where(eq(llms.slug, slug))

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
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
