import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useFetch from "./use-fetch";

export function useCredits() {
  const queryClient = useQueryClient();
  const authenticatedFetch = useFetch();

  return useQuery<number>({
    queryKey: ['credits'],
    queryFn: async () => {
      const response = await authenticatedFetch('/api/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      const data = await response.json();

      return data as number;
    },
  });
}
