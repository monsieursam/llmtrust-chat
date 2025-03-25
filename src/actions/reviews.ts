import type { ReviewWithUser } from "@/app/api/reviews/types";
import type { Review } from "@/db/schema";
import fetchApi from "@/lib/fetch";
import { revalidateTag } from "next/cache";

export enum ReviewType {
  AIAPP = "aiapps",
  MODEL = "models",
}

export async function createReview({ id, type, body }: {
  id: string, type: ReviewType, body: Review
}) {
  const response = await fetchApi(`/api/reviews/${type}/${id}`, { body: JSON.stringify(body), method: 'POST' });
  const data = await response.json();

  revalidateTag(`reviews:${type}:${id}`);

  return data as Review;
}

export async function fetchAllReviews({ id, type }: { id: string, type: ReviewType }) {
  const response = await fetchApi(`/api/reviews/${type}/${id}`, {
    next: {
      tags: [`reviews:${type}:${id}`]
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

export async function fetchReviewsStatsByTypeById({ id, type }: { id: string, type: ReviewType }) {
  const response = await fetchApi(`/api/reviews/${type}/${id}/stats`);
  const data = await response.json();

  return data as { [key: number]: number };
}
