'use server'

import type { AiAppWithLLM } from '@/app/api/aiapps/route';
import type { AiApp, Review } from '@/db/schema';
import fetchApi from '@/lib/fetch';
import { revalidateTag } from 'next/cache';

export async function fetchAllAIApps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aiapps`, { next: { tags: ['aiapps'] } });
  const data = await response.json();

  return data as AiAppWithLLM[];
}

export async function fetchOneAIApp(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aiapps/${slug}`, { next: { tags: [`aiapps/${slug}`] } });
  const data = await response.json();

  return data as AiAppWithLLM;
}

export async function createAIApp(data: Partial<AiApp>) {
  const response = await fetchApi("/api/aiapps", { body: JSON.stringify(data), method: "POST" });
  const newData = await response.json();

  revalidateTag('aiapps');

  return newData as AiApp;
}

export async function updateAIApp({ slug, data }: { slug: string, data: Partial<AiApp> }) {
  const response = await fetchApi(`/api/aiapps/${slug}`, { body: JSON.stringify(data), method: "PUT" });
  const newData = await response.json();

  revalidateTag(`aiapps/${slug}`);
  return newData as AiApp;
}

export async function deleteAIApp({ slug }: { slug: string }) {
  const response = await fetchApi(`/api/aiapps/${slug}`, { method: "DELETE" });
  const newData = await response.json();

  revalidateTag(`aiapps/${slug}`);
  revalidateTag('aiapps');

  return newData as AiApp;
}
