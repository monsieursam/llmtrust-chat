import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAppTable } from "./ai-app-table"
import { ModelTable } from "./model-table"
import { fetchAllLLM } from "@/actions/models";

export default async function AdminClient() {
  const models = await fetchAllLLM();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="aiapps">AI Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <ModelTable models={models} />
        </TabsContent>
        <TabsContent value="aiapps">
          {/* <AIAppTable /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
