'use server'

import type { LLMWithAiApps } from "@/app/api/models/route";
import { tags, type AiApp, type LLM } from "@/db/schema";
import fetchApi from "@/lib/fetch";
import { revalidateTag } from "next/cache";

export async function fetchAllLLM() {
  const response = await fetch('/api/models', { next: { tags: ['models'] } });
  const data = await response.json();

  return data as LLM[];
}

export async function fetchOneLLM(slug: string) {
  const response = await fetch(`/api/models/${slug}`, { next: { tags: [`models/${slug}`] } });
  const data = await response.json();

  return data as LLMWithAiApps;
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
  const response = await fetch("/api/models/latest", { next: { tags: ['models/latest'] } });
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

export async function createLLM(body: Partial<LLM>) {
  const response = await fetchApi('/api/models', { body: JSON.stringify(body), method: "POST" });
  const data = await response.json();

  revalidateTag('models');
  revalidateTag('models/latest');

  return data as LLM;
}

export async function updateLLM({ slug, data }: { slug: string, data: Partial<LLM> }) {
  const response = await fetchApi(`/api/models/${slug}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });

  revalidateTag('models');
  revalidateTag(`models/${slug}`);

  const newData = await response.json();

  return newData as LLM;
}

export async function deleteLLM({ slug }: { slug: string }) {
  const response = await fetchApi(`/api/models/${slug}`, { method: "DELETE" });
  const newData = await response.json()

  revalidateTag('models');
  revalidateTag(`models/${slug}`);

  return newData as LLM;
}
