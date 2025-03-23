import type { Review } from "@/db/schema";
import fetchApi from "@/lib/fetch";

export enum ReviewType {
  AIAPP = "aiapps",
  MODEL = "models",
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatarUrl: string;
  };
}

export async function createReview({ id, type, body }: {
  id: string, type: ReviewType, body: Review
}) {
  const response = await fetchApi(`/api/${type}/${id}/reviews`, { body: JSON.stringify(body), method: 'POST' });
  const data = await response.json();

  return data as Review;
}

export async function fetchAllReviews({ id, type }: { id: string, type: ReviewType }) {
  const response = await fetchApi(`/api/${type}/${id}/reviews`);
  const data = await response.json();

  return data as ReviewWithUser[];
}

// export async function deleteReview({ id, type, reviewId }: { id: string, type: ReviewType, reviewId: string }) {
//   const response = await axiosInstance.delete(`/api/${type}/${id}/reviews/${reviewId}`);

//   return response?.data as Review;
// }

export async function fetchReviewsStatsByTypeById({ id, type }: { id: string, type: ReviewType }) {
  const response = await fetchApi(`/api/${type}/${id}/reviews/stats`);
  const data = await response.json();

  return data as { [key: number]: number };
}
