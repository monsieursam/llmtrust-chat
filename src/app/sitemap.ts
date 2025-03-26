import { fetchAllAIApps } from "@/actions/aiapps";
import { fetchAllLLM } from "@/actions/models";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://llmtrust.com";

  // Define static routes
  const routes = [
    "",
    "/about",
    "/models",
    "/docs",
    "/chat",
    "/search",
    "/aiapps",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));

  // Get all LLM models for dynamic routes
  try {
    const llms = await fetchAllLLM();
    const llmRoutes = llms.map((llm) => ({
      url: `${baseUrl}/models/${llm.slug}`,
      lastModified: new Date(llm.updatedAt),
      changeFrequency: "daily",
      priority: 0.9
    }));

    const aiapps = await fetchAllAIApps();
    const aiappsRoutes = aiapps.map((aiapp) => ({
      url: `${baseUrl}/aiapps/${aiapp.slug}`,
      lastModified: new Date(aiapp.updatedAt),
      changeFrequency: "daily",
      priority: 0.9
    }));

    return [...routes, ...llmRoutes, ...aiappsRoutes];
  } catch (error) {
    console.error("Error fetching LLMs for sitemap:", error);
    return routes;
  }
}
