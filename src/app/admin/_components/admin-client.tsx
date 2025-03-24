import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAppTable } from "./ai-app-table"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminClient() {

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="aiapps">AI Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <Card className="p-6 my-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">LLM Models</h2>
              <Button asChild>
                <Link href="/admin/models">Manage Models</Link>
              </Button>
            </div>
            <p className="text-muted-foreground">Manage your LLM models, add new models, or edit existing ones.</p>
          </Card>
        </TabsContent>
        <TabsContent value="aiapps">
          {/* <AIAppTable /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
