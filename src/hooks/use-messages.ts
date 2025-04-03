import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/providers/trpc-provider';

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const messageQuery = trpc.message.getMessages.queryOptions({ conversationId });
  const creditsQuery = trpc.credits.getBalance.queryOptions();

  // Query for fetching messages for a specific conversation
  const query = useQuery(messageQuery);

  // Mutation for saving a new message
  const createMessage = useMutation(trpc.message.createMessage.mutationOptions({
    onSuccess: (newMessage) => {
      // Invalidate the messages query to refetch
      queryClient.invalidateQueries(
        messageQuery,
      );
      // Invalidate the credits query to refetch
      queryClient.invalidateQueries(
        creditsQuery,
      );
    },
  }));

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveMessage: createMessage.mutate,
    isSaving: createMessage.isPending,
  };
}
