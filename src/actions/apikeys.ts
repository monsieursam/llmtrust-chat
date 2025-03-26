import type { ApiKey } from "@/db/schema";
import fetchApi from "@/lib/fetch";



export async function fetchApiKeys() {
  const response = await fetchApi("/api/apikeys", { next: { tags: ['apikeys'] } });
  const data = await response.json();

  return data as ApiKey[];
}

export async function createApiKey() {
  const response = await fetchApi("/api/apikeys", { method: "POST" });
  const data = await response.json();

  return data as ApiKey;
}
