import { fetchAllLLM } from "@/actions/models";
import LLMCard from "@/components/llm-card";

export default async function Page() {
  const llms = await fetchAllLLM()

  return (
    <div className="flex-1 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Language Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {llms?.map((llm) => (
          <LLMCard key={llm.id} llm={llm} />
        ))}
      </div>
    </div>
  );
}
