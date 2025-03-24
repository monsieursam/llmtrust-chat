import { createReview, fetchAllReviews, ReviewType } from "@/actions/reviews";
import { db } from "@/db";
import { reviews, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

type Params = Promise<{ slug: string }>;

export async function GET(req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = await params;
    console.log(slug);
    const llmReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        content: reviews.content,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name, // Adjust based on your actual user schema
          // Add other user fields you want to include
        }
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.llmId, slug))
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
        llmId: slug,
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
