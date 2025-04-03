import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/providers/trpc-provider';

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const messageQuery = trpc.message.getMessages.queryOptions({ conversationId });
  const creditsQuery = trpc.credits.getBalance.queryOptions();

  // Query for fetching messages for a specific conversation
  const query = useQuery(messageQuery);

  const invalidateMessageQuery = () => {
    queryClient.invalidateQueries(messageQuery);
  }

  return {
    messages: query.data || [],
    invalidateMessageQuery,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
