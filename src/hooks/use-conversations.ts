import { useTRPC } from '@/providers/trpc-provider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useConversations() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const conversationQuery = trpc.conversation.getAllConversations.queryOptions();

  // Query for fetching all conversations
  const query = useQuery(conversationQuery);

  // Mutation for creating a new conversation
  const createMutation = useMutation(trpc.conversation.createConversation.mutationOptions({
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries(conversationQuery);
    },
  }));

  const updateMutation = useMutation(trpc.conversation.updateConversation.mutationOptions({
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries(conversationQuery);
    },
  }));

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createConversationData: createMutation.data,
    createConversation: createMutation.mutateAsync,
    updateConversation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
