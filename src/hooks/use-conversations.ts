import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/providers/trpc-provider';

export function useConversations() {
  const queryClient = useQueryClient();

  // Query for fetching all conversations
  const query = trpc.conversation.getAllConversations.useQuery();

  // Mutation for creating a new conversation
  const createMutation = trpc.conversation.createConversation.useMutation({
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const updateMutation = trpc.conversation.updateConversation.useMutation({
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

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
