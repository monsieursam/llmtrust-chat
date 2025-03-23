import { createReview, fetchAllReviews, ReviewType } from "@/actions/reviews";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const reviewsWithUsers = await db.query.reviews.findMany({
      where: eq(reviews.llmId, id),
      with: {
        user: true
      }
    });

    return NextResponse.json(reviewsWithUsers, { status: 200 });
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
    const { id } = await params;

    const [newReview] = await db.insert(reviews)
      .values({
        rating: reviewData.rating,
        content: reviewData.content,
        llmId: id,
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
