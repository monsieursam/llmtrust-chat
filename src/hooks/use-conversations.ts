import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/db/schema';
import useFetch from './use-fetch';
import { trpc } from '@/providers/trpc-provider';


interface UpdateConversationData {
  id: string;
  title: string;
}

export function useConversations() {
  const queryClient = useQueryClient();
  const authenticatedFetch = useFetch();

  const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await authenticatedFetch('/api/conversations');

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    return response.json();
  };

  // Query for fetching all conversations
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

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
