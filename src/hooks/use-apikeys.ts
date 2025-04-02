import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/providers/trpc-provider";

export function useApiKeys() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const apiKeys = trpc.apiKeys.list.queryOptions();

  const query = useQuery(apiKeys);

  const createMutation = useMutation(trpc.apiKeys.create.mutationOptions({
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries(
        apiKeys,
      );
    },
  }));

  return {
    apiKeys: query.data,
    isLoading: query.isLoading,
    createApiKey: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
