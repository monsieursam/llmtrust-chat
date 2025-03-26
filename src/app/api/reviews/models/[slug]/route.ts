import { db } from "@/db";
import { llms, reviews, users, type Review } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import type { ReviewWithUser } from "../../types";
import type { ApiSlugParams } from "@/app/api/types";


export async function GET(req: NextRequest,
  { params }: { params: ApiSlugParams }
) {
  try {
    const { slug } = await params;
    console.log(slug);
    const llm = await db.query.llms.findFirst({
      where: (Llms, { eq }) => eq(Llms.slug, slug)
    });

    if (!llm) {
      return NextResponse.json(
        { error: "AI App not found" },
        { status: 404 }
      );
    }

    const aiAppReviews: ReviewWithUser[] = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        content: reviews.content,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          image_url: users.image_url,
          first_name: users.first_name,
          last_name: users.last_name,
        }
      })
      .from(reviews)
      .where(eq(reviews.llmId, llm.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .orderBy(reviews.createdAt);

    return NextResponse.json(aiAppReviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest,
  { params }: { params: ApiSlugParams }
) {
  try {
    const reviewData = await req.json();
    const { slug } = await params;

    const llm = await db.query.llms.findFirst({
      where: (Llms, { eq }) => eq(Llms.slug, slug)
    });
    if (!llm) {
      return NextResponse.json(
        { error: "AI App not found" },
        { status: 404 }
      )
    }

    const [newReview] = await db.insert(reviews)
      .values({
        rating: reviewData.rating,
        content: reviewData.content,
        llmId: llm.id,
        userId: reviewData.userId,
      })
      .returning();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
