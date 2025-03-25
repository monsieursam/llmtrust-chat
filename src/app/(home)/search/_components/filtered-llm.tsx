'use client'

import LLMCard from "@/components/llm-card";
import type { LLM } from "@/db/schema";



interface Props {
  llms: LLM[];
}

export function FilteredLLM({ llms }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {llms?.map((llm) => (
        <LLMCard key={llm.id} llm={llm} />
      ))}
    </div>
  );
}
