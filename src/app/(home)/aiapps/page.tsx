import { fetchAllAIApps } from "@/actions/aiapps";
import AIAppCard from "./_components/ai-app-card";

export const revalidate = 3600;

export default async function AIAppsPage() {
  const aiApps = await fetchAllAIApps();

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Apps</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiApps?.map((app) => (
          <AIAppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  )
}
