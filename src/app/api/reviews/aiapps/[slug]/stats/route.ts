import type { NextRequest } from "next/server";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = Promise<{ slug: string }>;

export async function GET(req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = await params;
    const aiapp = await db.query.aiApps.findFirst({
      where: (aiApps, { eq }) => eq(aiApps.slug, slug)
    });
    if (!aiapp) {
      return NextResponse.json(
        { error: "AI App not found" },
        { status: 404 }
      );
    }

    const reviewsData = await db
      .select()
      .from(reviews)
      .where(eq(reviews.aiAppId, aiapp.id));

    // Initialize stats object with 0 counts for ratings 1-5
    const stats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    // Count reviews for each rating
    // biome-ignore lint/complexity/noForEach: <explanation>
    reviewsData.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        stats[review.rating as keyof typeof stats]++;
      }
    });

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
