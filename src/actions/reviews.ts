'use server'

import type { ReviewType, ReviewWithUser } from "@/app/api/reviews/types";
import type { Review } from "@/db/schema";
import fetchApi from "@/lib/fetch";
import { revalidateTag } from "next/cache";

export async function createReview({ slug, type, body }: {
  slug: string, type: ReviewType, body: Partial<Review>
}) {
  const response = await fetchApi(`/api/reviews/${type}/${slug}`, { body: JSON.stringify(body), method: 'POST' });
  const data = await response.json();

  revalidateTag(`reviews/${type}/${slug}`);

  return data as Review;
}

export async function fetchAllReviews({ slug, type }: { slug: string, type: ReviewType }) {
  const response = await fetchApi(`/api/reviews/${type}/${slug}`, {
    next: {
      tags: [`reviews/${type}/${slug}`]
    }
  }
  );
  const data = await response.json();

  return data as ReviewWithUser[];
}

// export async function deleteReview({ id, type, reviewId }: { id: string, type: ReviewType, reviewId: string }) {
//   const response = await axiosInstance.delete(`/api/${type}/${id}/reviews/${reviewId}`);

//   return response?.data as Review;
// }

export async function fetchReviewsStatsByTypeById({ slug, type }: { slug: string, type: ReviewType }) {
  const response = await fetchApi(`/api/reviews/${type}/${slug}/stats`);
  const data = await response.json();

  return data as { [key: number]: number };
}
