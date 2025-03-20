'use server'

import type { LLM } from "@/db/schema";
import fetchApi from "@/lib/fetch";

// export async function fetchAllLLM() {
//   const response = await axiosInstanceStatic.get("/api/models");
//   return response?.data as LLM[];
// }

export async function fetchOneLLM(slug: string) {
  const response = await fetchApi(`/api/models/${slug}`);
  const data = await response.json();

  return data as LLM;
}

// export async function fetchNumberReview() {
//   const response = await axiosInstanceStatic.get("/api/reviews/count");
//   return response?.data as number;
// }



// export async function fetchNumberModel() {
//   const response = await axiosInstanceStatic.get("/api/models/count");
//   return response?.data as number;
// }

export async function fetchLatestModels() {
  const response = await fetchApi("/api/models/latest");
  const data = await response.json();

  return data as LLM[];
}

// export async function fetchLatestReviews() {
//   const response = await axiosInstanceStatic.get("/api/reviews/latest");
//   return response?.data?.data as Review[];
// }

// export async function fetchRatingSummary() {
//   const response = await axiosInstanceStatic.get("/api/reviews/stats");
//   return response?.data as RatingStats;
// }

// export async function fetchRatingSummaryByLLM({ id }: { id: string }) {
//   const response = await axiosInstanceStatic.get(`/api/reviews/stats/${id}`);
//   return response?.data as RatingStats;
// }

// export async function createLLM(data: Partial<LLM>) {
//   const response = await axiosInstance.post('/api/models', data);
//   return response?.data as LLM;
// }

// export async function updateLLM({ id, data }: { id: string, data: Partial<LLM> }) {
//   const response = await axiosInstance.patch(`/api/models/${id}`, data);
//   return response?.data as LLM;
// }

// export async function deleteLLM({ id }: { id: string }) {
//   const response = await axiosInstance.delete(`/api/models/${id}`);

//   return response?.data as LLM;
// }
