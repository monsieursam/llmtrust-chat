import { db } from "@/db";
import { reviews, users, type Review } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import type { ReviewWithUser } from "../../types";

type Params = Promise<{ slug: string }>;

export async function GET(req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = await params;

    const llmReviews: ReviewWithUser[] = await db
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
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.aiAppId, slug))
      .orderBy(reviews.createdAt)

    return NextResponse.json(llmReviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const reviewData = await req.json();
    const { slug } = await params;

    const [newReview] = await db.insert(reviews)
      .values({
        rating: reviewData.rating,
        content: reviewData.content,
        aiAppId: slug,
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
