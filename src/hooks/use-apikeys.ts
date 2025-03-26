import type { ApiKey } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useFetch from "./use-fetch";

export function useApiKeys() {
  const queryClient = useQueryClient();
  const authenticatedFetch = useFetch();

  const fetchApiKeys = async (): Promise<ApiKey[]> => {
    const response = await authenticatedFetch('/api/apikeys');

    if (!response.ok) {
      throw new Error('Failed to fetch api keys');
    }

    return response.json();
  };

  const query = useQuery({
    queryKey: ['apikeys'],
    queryFn: fetchApiKeys,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/apikeys');

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apikeys'] });
    },
  });

  return {
    apiKeys: query.data,
    isLoading: query.isLoading,
    createApiKey: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
