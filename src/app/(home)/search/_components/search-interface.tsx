'use client'

import { SearchIcon } from "lucide-react";
import { FilteredLLM } from "./filtered-llm";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import type { AiApp, LLM } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



interface SearchResults {
  llms: LLM[]
  aiapps: AiApp[]
}

export default function SearchInterface() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [searchInput, setSearchInput] = useState(query || '');
  const [results, setResults] = useState<SearchResults>({ llms: [], aiapps: [] });
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch) {
        setResults({ llms: [], aiapps: [] })
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search?name=${encodeURIComponent(debouncedSearch)}`)

        const data = response.data as SearchResults
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults({ llms: [], aiapps: [] })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearch])

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <div className="flex gap-4 max-w-2xl">
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for AI models and applications..."
            className="flex-1"
          />
          <Button disabled={isLoading}>
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {results.llms.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">AI Models</h2>
              <FilteredLLM llms={results.llms} />
            </section>
          )}

          {results.aiapps.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">AI Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.aiapps.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                    <p className="text-gray-600 mb-2">{app.description}</p>
                    <a
                      href={`/aiapps/${app.slug}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!results.llms.length && !results.aiapps.length && query && (
            <div className="text-center py-8 text-gray-600">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
