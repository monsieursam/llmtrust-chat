// import { FilteredLLM } from "@/components/client/filtered-llm";
import fetchApi from "@/lib/fetch";

export const revalidate = 3600;

export default async function Page() {
  const data = await fetchApi('/api/models', {
    method: 'GET',
  });
  const llms = await data.json();

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Language Models</h1>
      {/* <FilteredLLM llms={llms} /> */}
    </div>
  );
}
